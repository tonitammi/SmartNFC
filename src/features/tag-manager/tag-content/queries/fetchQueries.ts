import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { TagContent } from '../types';

export const fetchTagContentEntries = async (
  client: TypedSupabaseClient, 
  { tagId }: { tagId: string }
): Promise<TagContent[]> => {
  const { data } = await client.from('tag_content_assignments')
        .select(`
          tag_id,
          content:content_entries (*)
        `)
        .eq('tag_id', tagId)
        .order('created_at', { 
          referencedTable: 'content', 
          ascending: false,
        })
        .throwOnError();

  return data;
};

export const fetchTagContentEntry = async (
  client: TypedSupabaseClient, 
  { tagId, contentId }: {  tagId: string, contentId: string }
): Promise<TagContent | null> => {
  const { data } = await client.from('tag_content_assignments')
        .select(`
          tag_id,
          content:content_entries (*)
        `)
        .eq('tag_id', tagId)
        .eq('content_id', contentId)
        .single()
        .throwOnError();

  return data;
};
