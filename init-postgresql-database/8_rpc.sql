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
