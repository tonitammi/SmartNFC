import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';

export type GetTagNfcTagsParams = {
  tagId?: string;
  nfcTagId: string; 
} | {
  tagId: string;
  nfcTagId?: string; 
};

export const fetchTagNfcTags = async (
  client: TypedSupabaseClient, 
  { tagId, nfcTagId }: GetTagNfcTagsParams
) => {
  const baseQuery = client.from('tag_nfc_tags').select('*');

  if (tagId) baseQuery.eq('tag_id', tagId);
  if (nfcTagId) baseQuery.eq('nfc_tag_id', nfcTagId);

  const { data } = await baseQuery.throwOnError();
  return data;
};

export type GetTagNfcTagsByOrgParams = {
  orgId: string;
};

export const fetchTagNfcTagsByOrg = async (
  client: TypedSupabaseClient, 
  { orgId }: GetTagNfcTagsByOrgParams
) => {
  const { data } = await client
  .from('tag_nfc_tags')
  .select('*')
  .eq('org_id', orgId)
  .throwOnError();

  return data;
};