import { supabase } from '@/src/lib/supabase/supabaseClient';

    // org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    // folder_id UUID REFERENCES content_folders(id) ON DELETE CASCADE, 
    // title TEXT,
    // content_data JSONB NOT NULL, 
    // required_role TEXT NOT NULL CHECK (required_role IN ('visitor', 'user', 'editor', 'admin')),
    // is_shared BOOLEAN DEFAULT FALSE,
    // created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),

export const getContentEntries = async () => {
  return supabase.from('content_entries')
  .select('id, org_id, folder_id, title, content_data, created_by, required_role');
};

export const getContentEntryById = async (id: string) => {
  return supabase.from('content_entries')
  .select('id, org_id, folder_id, title, content_data, created_by, required_role')
  .eq('id', id)
  .single();
};

