-- 1 PUBLIC MEDIA

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1.1. INSERT (Upload): Allow owner, admins and editors to upload files
CREATE POLICY "Editors and above can upload to public_media bucket"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'public_media' 
  AND EXISTS (
    SELECT 1 FROM organization_users 
    WHERE user_id = auth.uid() 
    AND org_id = (storage.foldername(name))[1]::uuid
    AND role IN ('editor', 'admin', 'owner')
  )
);

-- 1.2. DELETE: Allow only owner and admins to delete files
CREATE POLICY "Only admins and owners can delete from public_media bucket"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'public_media' 
  AND EXISTS (
    SELECT 1 FROM organization_users 
    WHERE user_id = auth.uid() 
    AND org_id = (storage.foldername(name))[1]::uuid
    AND role IN ('admin', 'owner')
  )
);

-- 2 SHARED ASSETS

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2.1 Read everyone
CREATE POLICY "Shared assets public read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'shared_assets');

-- 2.2 Prevent Write, update and delete
