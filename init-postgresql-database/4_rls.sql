-- ___________________________________
-- 1. Content RLS
-- ___________________________________
ALTER TABLE content_entries ENABLE ROW LEVEL SECURITY;

-- 1.1. READ ACCESS
-- 1.1.1 ADMIN & EDITOR
CREATE POLICY "Admins and editors can view all org content" ON content_entries
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 1.1.2. USER
CREATE POLICY "Users can view visitor and user content" ON content_entries
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) = 'user' AND 
        required_role IN ('visitor', 'user')
    );

-- 1.1.3. VISITOR
CREATE POLICY "Anyone can view visitor content" ON content_entries
    FOR SELECT
    TO anon
    USING (required_role = 'visitor');

-- 1.2 CREATE, UPDATE AND DELETE ACCESS
-- 1.2.1 CREATE
CREATE POLICY "Admins and editors can insert content" ON content_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 1.2.2 UPDATE & DELETE
CREATE POLICY "Admins can update/delete all, editors only their own" ON content_entries
    FOR ALL -- Kattaa UPDATE ja DELETE
    TO authenticated
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid()) OR
        (get_user_org_role(org_id) = 'editor' AND created_by = auth.uid())
    );

-- 1.3 Content folders
ALTER TABLE content_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View folders based on role" ON content_folders
    FOR SELECT
    USING (
        org_id IN (SELECT org_id FROM organization_users WHERE user_id = auth.uid())
        AND (
            -- Käyttäjän oma rooli orgissa pitää olla >= kansion required_role
            get_user_org_role(org_id) = 'admin' OR
            (get_user_org_role(org_id) = 'editor' AND required_role IN ('visitor', 'user', 'editor')) OR
            (get_user_org_role(org_id) = 'user' AND required_role IN ('visitor', 'user'))
        )
    );

-- ___________________________________
-- 2 Organization RLS
-- ___________________________________

-- 2.1. ORGANIZATION
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
-- 2.1.1 INSERT: Authenticated users can insert organizations
CREATE POLICY "Authenticated users can insert organizations" ON organizations
    FOR INSERT
    TO authenticated
    WITH CHECK ( (SELECT auth.uid()) = owner_id );

-- 2.1.2 UPDATE: Only owners and admins can update organization
CREATE POLICY "Only owners and admins can update organization" ON organizations
    FOR UPDATE
    TO authenticated
    USING (
        get_user_org_role(id) = 'admin' OR 
        (SELECT auth.uid()) = owner_id
    );

-- 2.1.3 DELETE: Only owner can delete organization
CREATE POLICY "Only owner can delete organization" ON organizations
    FOR DELETE
    TO authenticated
    USING (
        (SELECT auth.uid()) = owner_id
    );

-- 2.1.4 READ: Only authenticated can select organization
CREATE POLICY "Only authenticated can select" ON organizations
    FOR SELECT
    TO authenticated
    USING ( auth.uid() IS NOT NULL );


-- 2.2 ORGANIZATION USERS

ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;
-- 2.2.1 OWNER JA ADMIN
CREATE POLICY "Only owners and admins can manage users" ON organization_users
    FOR ALL
    TO authenticated
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 2.2.2 JÄSENET: Korvataan silmukan aiheuttava EXISTS-lause funktiolla
CREATE POLICY "Members can view their own organization's user list" ON organization_users
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IS NOT NULL
    );

-- 2.3 Organization invitations
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- 1. READ: ORganization admin and invited user can read
CREATE POLICY "View invitations" ON organization_invitations
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin') 
        OR EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
        OR email = auth.jwt() ->> 'email'
    );

-- 2. LISÄYS: Vain Admin tai Owner voi kutsua
CREATE POLICY "Create invitations" ON organization_invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin') 
        OR EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 3. POISTO/MUOKKAUS: Vain ylläpitäjät voivat perua kutsun
CREATE POLICY "Manage invitations" ON organization_invitations
    FOR ALL
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin') 
        OR EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- ___________________________________
-- 3 Tag RLS
-- ___________________________________
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- 3.1. READ ACCESS
-- 3.1.1 ADMIN & EDITOR & USER
CREATE POLICY "Admins, editor and users can view all tags" ON tags
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor', 'user') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 3.2 CREATE, UPDATE AND DELETE ACCESS
-- 3.2.1 CREATE
CREATE POLICY "Admins and editors can insert tags" ON tags
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 3.2.2 UPDATE & DELETE
CREATE POLICY "Admins can update/delete all, editors only their own" ON tags
    FOR ALL
    TO authenticated
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid()) OR
        (get_user_org_role(org_id) = 'editor' AND created_by = auth.uid())
    );

-- 3.3 Tag folders
ALTER TABLE tag_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View NFC-tag folders based on role" ON tag_folders
    FOR SELECT
    USING (
        org_id IN (SELECT org_id FROM organization_users WHERE user_id = auth.uid())
        AND (
            -- Käyttäjän oma rooli orgissa pitää olla >= kansion required_role
            get_user_org_role(org_id) = 'admin' OR
            (get_user_org_role(org_id) = 'editor' AND required_role IN ('visitor', 'user', 'editor')) OR
            (get_user_org_role(org_id) = 'user' AND required_role IN ('visitor', 'user'))
        )
    );

-- ___________________________________
-- 4 Keywords RLS
-- ___________________________________
ALTER TABLE tag_keywords ENABLE ROW LEVEL SECURITY;

-- 4.1. READ ACCESS
-- 4.1.1 ADMIN & EDITOR & USER
CREATE POLICY "Admins, editors and users can view all keywords" ON tag_keywords
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor', 'user') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 4.2 CREATE, UPDATE AND DELETE ACCESS
-- 4.2.1 CREATE
CREATE POLICY "Admins and editors can insert keywords" ON tag_keywords
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 4.2.2 UPDATE & DELETE
CREATE POLICY "Admins can update/delete all, editors only their own" ON tag_keywords
    FOR ALL 
    TO authenticated
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid()) OR
        (get_user_org_role(org_id) = 'editor' AND created_by = auth.uid())
    );

-- ___________________________________
-- 5 Categories RLS
-- ___________________________________
ALTER TABLE tag_categories ENABLE ROW LEVEL SECURITY;

-- 5.1. READ ACCESS
-- 5.1.1 ADMIN & EDITOR & USER
CREATE POLICY "Admins, editors and users can view all categories" ON tag_categories
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor', 'user') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 5.2 CREATE, UPDATE AND DELETE ACCESS
-- 5.2.1 CREATE
CREATE POLICY "Admins and editors can insert categories" ON tag_categories
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 5.2.2 UPDATE & DELETE
CREATE POLICY "Admins can update/delete all, editors only their own" ON tag_categories
    FOR ALL 
    TO authenticated
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid()) OR
        (get_user_org_role(org_id) = 'editor' AND created_by = auth.uid())
    );


-- ___________________________________
-- 6. Tag groups RLS
-- ___________________________________
ALTER TABLE tag_groups ENABLE ROW LEVEL SECURITY;

-- READ: All organization users can read tag groups
CREATE POLICY "View tag groups" ON tag_groups
    FOR SELECT
    USING (get_user_org_role(org_id) IN ('admin', 'editor', 'user'));

-- CRUD: Admin/Owner and Editor (own) can insert, update and delete tag groups
CREATE POLICY "Manage tag groups" ON tag_groups
    FOR ALL
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid()) OR
        (get_user_org_role(org_id) = 'editor' AND created_by = auth.uid())
    );

-- ___________________________________
-- 7. Dynamic tag groups RLS
-- ___________________________________
ALTER TABLE dynamic_tag_groups ENABLE ROW LEVEL SECURITY;

-- READ: All organization users can read dynamic groups
CREATE POLICY "View dynamic groups" ON dynamic_tag_groups
    FOR SELECT
    USING (get_user_org_role(org_id) IN ('admin', 'editor', 'user'));

-- CRUD: Admin/Owner and Editor (own) can insert, update and delete 
CREATE POLICY "Manage dynamic groups" ON dynamic_tag_groups
    FOR ALL
    USING (
        get_user_org_role(org_id) = 'admin' OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid()) OR
        (get_user_org_role(org_id) = 'editor' AND created_by = auth.uid())
    );


-- JOIN TABLES 

-- ___________________________________
-- 8. Tag content assignments RLS
-- ___________________________________
ALTER TABLE tag_content_assignments ENABLE ROW LEVEL SECURITY;

-- READ: User can read assignments if has access to tag
CREATE POLICY "View tag assignments if has access to tag" ON tag_content_assignments
    FOR SELECT
    USING (
        -- User has an access through organization
        EXISTS (
            SELECT 1 FROM tags 
            WHERE id = tag_id AND org_id IN (
                SELECT org_id FROM organization_users WHERE user_id = auth.uid()
            )
        )
        OR 
        -- Content entry is public (required_role = 'visitor')
        EXISTS (
            SELECT 1 FROM content_entries
            WHERE id = content_id AND required_role = 'visitor'
        )
    );

-- CRUD: Only Admin/Editor can insert, update and delete 
CREATE POLICY "Manage tag assignments" ON tag_content_assignments
    FOR ALL
    USING (
        get_user_org_role((SELECT org_id FROM tags WHERE id = tag_id)) IN ('admin', 'editor')
    );

-- ___________________________________
-- 9. Tag categories RLS
-- ___________________________________
ALTER TABLE tags_categories ENABLE ROW LEVEL SECURITY;

-- READ: User can read categories if has access to tag
CREATE POLICY "View tag categories if has access to tag" ON tags_categories
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tags 
            WHERE id = tag_id AND org_id IN (
                SELECT org_id FROM organization_users WHERE user_id = auth.uid()
            )
        )
    );

-- CRUD: Only Admin/Editor can insert, update and delete 
CREATE POLICY "Manage tag categories" ON tags_categories
    FOR ALL
    USING (
        get_user_org_role((SELECT org_id FROM tags WHERE id = tag_id)) IN ('admin', 'editor')
    );

-- ___________________________________
-- 10. Tag keywords RLS
-- ___________________________________
ALTER TABLE tags_keywords ENABLE ROW LEVEL SECURITY;

-- READ: User can read keywords if has access to tag
CREATE POLICY "View tag keywords if has access to tag" ON tags_keywords
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tags 
            WHERE id = tag_id AND org_id IN (
                SELECT org_id FROM organization_users WHERE user_id = auth.uid()
            )
        )
    );

-- CRUD: Only Admin/Editor can insert, update and delete 
CREATE POLICY "Manage tag keywords" ON tags_keywords
    FOR ALL
    USING (
        get_user_org_role((SELECT org_id FROM tags WHERE id = tag_id)) IN ('admin', 'editor')
    );

-- ___________________________________
-- 11. Tag groups RLS
-- ___________________________________
ALTER TABLE tag_group_tags ENABLE ROW LEVEL SECURITY;

-- READ: User can read tag groups if has access to tag
CREATE POLICY "View tag group tags if has access to tag" ON tag_group_tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tags 
            WHERE id = tag_id AND org_id IN (
                SELECT org_id FROM organization_users WHERE user_id = auth.uid()
            )
        )
    );

-- CRUD: Only Admin/Editor can insert, update and delete 
CREATE POLICY "Manage tag group tags" ON tag_group_tags
    FOR ALL
    USING (
        get_user_org_role((SELECT org_id FROM tags WHERE id = tag_id)) IN ('admin', 'editor')
    );

-- ___________________________________
-- 12 Tag NFC tags
-- ___________________________________
ALTER TABLE tag_nfc_tags ENABLE ROW LEVEL SECURITY;

-- 12.1. READ ACCESS
-- 12.1.1 ADMIN & EDITOR & USER
CREATE POLICY "Admins, editors and users can view all tag NFC tags" ON tag_nfc_tags
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor', 'user') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 12.2 CREATE, UPDATE AND DELETE ACCESS
CREATE POLICY "Admins and editors can insert tag NFC tags" ON tag_nfc_tags
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- ___________________________________
-- 13 NFC Scan Logs
-- ___________________________________
ALTER TABLE public.nfc_scan_logs ENABLE ROW LEVEL SECURITY;

-- 1. INSERT: Kuka tahansa voi luoda lokimerkintöjä (anon + authenticated)
DROP POLICY IF EXISTS "Anyone can insert scan logs" ON public.nfc_scan_logs;
CREATE POLICY "Anyone can insert scan logs" ON public.nfc_scan_logs
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 2. SELECT: Organisaation jäsenet (user, editor, admin) ja omistaja voivat lukea
DROP POLICY IF EXISTS "Organization members and owner can view scan logs" ON public.nfc_scan_logs;
CREATE POLICY "Organization members and owner can view scan logs" ON public.nfc_scan_logs
    FOR SELECT
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor', 'user') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

-- 3. UPDATE & DELETE: Vain organisaation editor, admin ja owner voivat muokata ja poistaa
DROP POLICY IF EXISTS "Admins, editors and owner can update and delete scan logs" ON public.nfc_scan_logs;
CREATE POLICY "Admins, editors and owner can update and delete scan logs" ON public.nfc_scan_logs
    FOR UPDATE
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    )
    WITH CHECK (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins, editors and owner can delete scan logs" ON public.nfc_scan_logs;
CREATE POLICY "Admins, editors and owner can delete scan logs" ON public.nfc_scan_logs
    FOR DELETE
    TO authenticated
    USING (
        get_user_org_role(org_id) IN ('admin', 'editor') OR 
        EXISTS (SELECT 1 FROM organizations WHERE id = org_id AND owner_id = auth.uid())
    );
