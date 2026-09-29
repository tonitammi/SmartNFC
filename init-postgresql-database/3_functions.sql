-- 1. Get users organization role
CREATE OR REPLACE FUNCTION get_user_org_role(target_org_id UUID)
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.organization_users 
        WHERE org_id = target_org_id AND user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Tämä SECURITY DEFINER on avainasemassa

-- 2. Can user manage organization storage
CREATE OR REPLACE FUNCTION can_manage_org_storage(org_id_param uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_users
    WHERE user_id = auth.uid()
    AND org_id = org_id_param
    AND role IN ('editor', 'admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create organization to new user
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS trigger AS $$
DECLARE
  new_org_id uuid;
  org_name text;
BEGIN
  org_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)) || ' Org';

  INSERT INTO public.organizations (name, display_name, owner_id)
  VALUES (org_name, org_name, new.id)
  RETURNING id INTO new_org_id;

  INSERT INTO public.organization_users (org_id, user_id, email, role)
  VALUES (new_org_id, new.id, new.email, 'admin');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Accept organization invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_id UUID)
RETURNS void AS $$
DECLARE
    target_org_id UUID;
    target_role TEXT;
    target_email TEXT;
BEGIN
    -- 1. Haetaan kutsun tiedot
    SELECT org_id, role, email INTO target_org_id, target_role, target_email
    FROM organization_invitations
    WHERE id = invitation_id AND status = 'pending' AND expires_at > NOW();

    -- 2. Tarkistetaan löytyikö kutsua
    IF target_email IS NULL THEN
        RAISE EXCEPTION 'Invitation not found, already used or expired';
    END IF;

    -- 3. Tarkistetaan täsmääkö sähköposti kirjautuneeseen käyttäjään
    IF target_email != auth.jwt() ->> 'email' THEN
        RAISE EXCEPTION 'This invitation belongs to another email address';
    END IF;

    -- 4. LISÄTTY 'email' sarakkeeseen syöttö tässä:
    INSERT INTO organization_users (org_id, user_id, role, email)
    VALUES (target_org_id, auth.uid(), target_role, target_email);

    -- 5. Päivitetään kutsu käytetyksi
    UPDATE organization_invitations
    SET status = 'accepted'
    WHERE id = invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4.1 Set invitation status
CREATE OR REPLACE FUNCTION public.set_invitation_status(
    invitation_id UUID,
    new_status TEXT
)
RETURNS void AS $$
DECLARE
    target_org_id UUID;
    target_role TEXT;
    target_email TEXT;
BEGIN
    -- 1. Tarkistetaan, että annettu tila on sallittu
    IF new_status NOT IN ('pending', 'accepted', 'declined') THEN
        RAISE EXCEPTION 'Invalid status. Allowed values are: pending, accepted, declined';
    END IF;

    -- 2. Haetaan kutsun tiedot (edellyttää, että kutsu ei ole vanhentunut)
    SELECT org_id, role, email INTO target_org_id, target_role, target_email
    FROM organization_invitations
    WHERE id = invitation_id AND expires_at > NOW();

    -- 3. Tarkistetaan löytyikö kutsua
    IF target_email IS NULL THEN
        RAISE EXCEPTION 'Invitation not found or expired';
    END IF;

    -- 4. Tarkistetaan täsmääkö sähköposti kirjautuneeseen käyttäjään
    IF target_email != auth.jwt() ->> 'email' THEN
        RAISE EXCEPTION 'This invitation belongs to another email address';
    END IF;

    -- 5. Jos tila on 'accepted', lisätään käyttäjä organisaatioon (jos ei jo löydy)
    IF new_status = 'accepted' THEN
        INSERT INTO organization_users (org_id, user_id, role, email)
        VALUES (target_org_id, auth.uid(), target_role, target_email)
        ON CONFLICT (org_id, user_id) DO NOTHING;
    END IF;

    -- 6. Päivitetään kutsun tila
    UPDATE organization_invitations
    SET status = new_status
    WHERE id = invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Check that content folder isn't moved to another organization
CREATE OR REPLACE FUNCTION check_folder_org_consistency()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        IF (SELECT org_id FROM content_folders WHERE id = NEW.parent_id) != NEW.org_id THEN
            RAISE EXCEPTION 'Parent folder must belong to the same organization';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. update_nfc_scan_count NOT ADDED
CREATE OR REPLACE FUNCTION update_nfc_scan_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tag_nfc_tags
    SET scan_count = scan_count + 1,
        last_scanned_at = NOW()
    WHERE nfc_tag_id = NEW.nfc_tag_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7.
CREATE OR REPLACE FUNCTION create_organization_with_admin(org_name TEXT, org_display_name TEXT DEFAULT NULL)
RETURNS SETOF organizations AS $$
DECLARE
  new_org organizations;
BEGIN
  INSERT INTO organizations (name, display_name, owner_id)
  VALUES (org_name, COALESCE(org_display_name, org_name), auth.uid())
  RETURNING * INTO new_org;

  INSERT INTO organization_users (org_id, user_id, email, role)
  VALUES (
    new_org.id, 
    auth.uid(), 
    (SELECT email FROM auth.users WHERE id = auth.uid()), 
    'admin'
  );

  RETURN NEXT new_org;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Get stats by organization
CREATE OR REPLACE FUNCTION get_tag_stats_by_org(p_org_id UUID, p_limit BIGINT = 5)
RETURNS TABLE (
    tag_id UUID,
    tag_label TEXT,  
    nfc_tag_count BIGINT,
    scan_count BIGINT,
    last_scanned_at TIMESTAMPTZ
) 
LANGUAGE sql
SECURITY INVOKER
AS $$
    SELECT 
        tnt.tag_id, 
        t.label as tag_label, -- Otetaan label tags-taulusta
        COUNT(tnt.*) as nfc_tag_count, 
        SUM(tnt.scan_count) as scan_count, 
        MAX(tnt.last_scanned_at) as last_scanned_at 
    FROM tag_nfc_tags tnt
    JOIN tags t ON tnt.tag_id = t.id -- Tehdään liitos tags-tauluun
    WHERE tnt.org_id = p_org_id
    GROUP BY tnt.tag_id, t.label -- Lisättävä GROUP BY -osaan
    ORDER BY scan_count DESC
    LIMIT p_limit;
$$;


-- 9. Analytics get scans per day (last 7 days)
CREATE OR REPLACE FUNCTION get_scans_per_day(p_org_id UUID)
RETURNS TABLE (
    day_date DATE,
    day_index DOUBLE PRECISION, -- 1=Ma, 2=Ti ... 7=Su
    scan_count BIGINT
) 
LANGUAGE sql
SECURITY INVOKER
AS $$
    SELECT 
        series.day::date AS day_date,
        extract(isodow from series.day) AS day_index,
        COUNT(logs.id) AS scan_count
    FROM generate_series(
        date_trunc('day', now() - interval '6 days'), 
        date_trunc('day', now()), 
        interval '1 day'
    ) AS series(day)
    LEFT JOIN nfc_scan_logs logs ON 
        date_trunc('day', logs.scanned_at) = series.day 
        AND logs.org_id = p_org_id
    GROUP BY series.day
    ORDER BY series.day ASC;
$$;

-- 10. Analytics get scans per hour (last 24h)
CREATE OR REPLACE FUNCTION get_scans_per_hour(p_org_id UUID)
RETURNS TABLE (hour_timestamp TIMESTAMPTZ, scan_count BIGINT) 
LANGUAGE sql SECURITY INVOKER AS $$
    SELECT 
        series.hour AS hour_timestamp,
        COUNT(logs.id) AS scan_count
    FROM generate_series(
        date_trunc('hour', now() - interval '23 hours'), 
        date_trunc('hour', now()), 
        interval '1 hour'
    ) AS series(hour)
    LEFT JOIN nfc_scan_logs logs ON 
        date_trunc('hour', logs.scanned_at) = series.hour 
        AND logs.org_id = p_org_id
    GROUP BY series.hour
    ORDER BY series.hour ASC;
$$;