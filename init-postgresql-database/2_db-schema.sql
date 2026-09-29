-- SmartNFC Manager Database Schema (PostgreSQL / Supabase)

-- 1. Organisation ja organizations users
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT DEFAULT 'My Organization',
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Organization users
CREATE TABLE organization_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'editor', 'admin')),
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE(org_id, user_id, email)
);

-- Organization invitations
CREATE TABLE organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'user')) DEFAULT 'user',
    invited_by UUID REFERENCES auth.users(id) DEFAULT auth().uid() ON DELETE SET NULL,
    inviter_email TEXT NOT NULL DEFAULT  auth.jwt() ->> 'email',
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
    user_notified BOOLEAN DEFAULT false,
    token UUID DEFAULT gen_random_uuid(), -- Valinnainen: turvallisuutta varten linkkeihin
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

    -- Estetään useat päällekkäiset kutsut samalle sähköpostille samaan orgiin
    UNIQUE(org_id, email)
);

-- 2. Categories and keywords
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    name TEXT NOT NULL,
    UNIQUE(org_id, name)
);

CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    name TEXT NOT NULL,
    UNIQUE(org_id, name)
);

-- 3. Content 
CREATE TABLE content_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES content_folders(id) ON DELETE CASCADE, 
    title TEXT,
    content_data JSONB NOT NULL, 
    required_role TEXT NOT NULL CHECK (required_role IN ('visitor', 'user', 'editor', 'admin')),
    
    is_shared BOOLEAN DEFAULT TRUE, 
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TEMPORARY
-- ALTER TABLE content_entries 
--   ADD CONSTRAINT fk_content_folder 
--   FOREIGN KEY (folder_id) 
--   REFERENCES content_folders(id) 
--   ON DELETE CASCADE;

-- 3.1 Content folder
CREATE TABLE content_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES content_folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    required_role TEXT NOT NULL DEFAULT 'editor' CHECK (required_role IN ('visitor', 'user', 'editor', 'admin')),
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tags (Tag info) 
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES tag_folders(id),
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    label TEXT NOT NULL,
    
    -- Location information 
    address TEXT,
    building TEXT,
    floor TEXT,
    room TEXT,
    specific_location TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 4.1 Tag folders
CREATE TABLE tag_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES tag_folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    required_role TEXT NOT NULL DEFAULT 'editor' CHECK (required_role IN ('visitor', 'user', 'editor', 'admin')),
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Physical NFC-tags NOT ADDED
CREATE TABLE tag_nfc_tags (
    nfc_tag_id TEXT PRIMARY KEY, 
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    label TEXT,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    last_scanned_at TIMESTAMPTZ,
    scan_count INTEGER DEFAULT 0
);

-- 4.3 NFC scan log NOT ADDED
CREATE TABLE nfc_scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nfc_tag_id TEXT REFERENCES tag_nfc_tags(nfc_tag_id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    scan_details JSONB,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);

-- 5. Tag group
CREATE TABLE tag_group (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    label TEXT NOT NULL,
    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    UNIQUE(label)
);

-- 6. Tag dynamic group
CREATE TABLE dynamic_tag_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id)DEFAULT auth.uid(),
    label TEXT NOT NULL,
    description TEXT,
    
    -- Filter options:
    -- { "floor": "3", "keywords": ["uuid-123-asd-123"], "categories": ["uuid-213-asd-123"], "building": "A" }
    filters JSONB NOT NULL DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, label)
);

-- 7. Join tables

-- 7.1 Connect tag and tag group
CREATE TABLE tag_group_tags (
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    tag_group_id UUID REFERENCES tag_group(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_group_id, tag_id)
);

-- 7.2 Connect tag and content (shared and unique)
CREATE TABLE tag_content_assignments (
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content_entries(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_id, content_id)
);

-- 7.3 Connect tag and category
CREATE TABLE tags_categories (
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_id, category_id)
);

-- 7.4 Connect tag and keyword
CREATE TABLE tags_keywords (
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_id, keyword_id)
);
