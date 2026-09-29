import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { ContentEntry } from '../types';

export const fetchOrganizationContentEntries = async (
  client: TypedSupabaseClient, 
  { orgId }: { orgId: string }
): Promise<ContentEntry[]> => {
  console.log('fetchOrganizationContentEntries');
  const { data } = await client.from('content_entries')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { 
          ascending: false,
        })
        .throwOnError();

  return data;
};

export const fetchOrganizationContentEntry = async (
  client: TypedSupabaseClient, 
  { orgId, contentId }: { orgId: string, contentId: string }
): Promise<ContentEntry> => {
  const { data } = await client.from('content_entries')
        .select('*')
        .eq('id', contentId)
        .eq('org_id', orgId)
        .single()
        .throwOnError();

  return data;
};

export const fetchContentEntryTags = async (
  client: TypedSupabaseClient, 
  { contentId }: { contentId: string }
) => {
  const { data } = await client.from('tag_content_assignments')
        .select(`
          tag:tags(id, label),
          content_id
        `)
        .eq('content_id', contentId)
        .throwOnError();

  return data;
};