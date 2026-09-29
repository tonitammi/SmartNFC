import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { InsertTag, UpdateTag, Tag } from '../types';
import { handleEmptyStrings } from '@/src/utils/data-formatting';

export const createTag = async (
    client: TypedSupabaseClient, 
    { tag } : { tag: InsertTag }
): Promise<Tag> => {
  const { data } = await client.from('tags')
        .insert(handleEmptyStrings(tag))
        .select('*')
        .single()
        .throwOnError();

  return data;
};

export const updateTag = async (
    client: TypedSupabaseClient, 
    { tagId, tag } : { tagId: string, tag: UpdateTag }
): Promise<Tag> => {
  const { data } = await client.from('tags')
        .update(handleEmptyStrings(tag))
        .eq('id', tagId)
        .select('*')
        .single()
        .throwOnError();
  return data;
};

export const deleteTag = async (
    client: TypedSupabaseClient, 
    { tagId }: { tagId: string }
): Promise<Tag> => {
  const { data } = await client.from('tags')
        .delete()
        .eq('id', tagId)
        .select('*')
        .single()
        .throwOnError();
  return data;
};