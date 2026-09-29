import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { InsertTagNfcTag } from '../types';

export const createTagNfcTag = async (
  client: TypedSupabaseClient, 
  tagNfcTag: InsertTagNfcTag
) => {

  const { data } = await client
  .from('tag_nfc_tags')
  .insert(tagNfcTag)
  .select('*')
  .single()
  .throwOnError();

  return data;
};

export type DeleteTagNfcTagParams = {
  tagId: string;
  nfcTagId?: string;
} | {
  tagId?: string;
  nfcTagId: string;
};

export const deleteTagNfcTag = async (
  client: TypedSupabaseClient, 
  { tagId, nfcTagId }: DeleteTagNfcTagParams
) => {
  const deleteQuery = client
  .from('tag_nfc_tags')
  .delete();

  if (tagId) deleteQuery.eq('tag_id', tagId);
  if (nfcTagId) deleteQuery.eq('nfc_tag_id', nfcTagId);

  const { data } = await deleteQuery
  .single()
  .throwOnError();

  return data;
};