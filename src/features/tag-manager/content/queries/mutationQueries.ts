import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { ContentEntry, InsertContentEntry, UpdateContentEntry } from '../types';


export const createContentEntry = async (
  client: TypedSupabaseClient,
  { contentEntry } : { contentEntry: InsertContentEntry }
): Promise<ContentEntry> => {
  const { data } = await client
      .from('content_entries')
      .insert(contentEntry)
      .select('*')
      .single()
      .throwOnError();

  return data;
};

export const updateContentEntry = async (
  client: TypedSupabaseClient,
  { contentId, contentEntry } : { 
    contentId: string; 
    contentEntry: UpdateContentEntry | ContentEntry; 
  }
): Promise<ContentEntry> => {

  const { data } = await client.from('content_entries')
        .update(contentEntry as UpdateContentEntry)
        .eq('id', contentId)
        .select()
        .single()
        .throwOnError();
  return data;
};


export const deleteContentEntry  = async (
  client: TypedSupabaseClient, 
  { contentId }: { contentId: string; }
): Promise<{ id: string }> => {
  const { data } = await client.from('content_entries')
        .delete()
        .eq('id', contentId)
        .select('id')
        .single()
        .throwOnError();

  return data;
};