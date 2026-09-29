import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import { tagKeywordsToKeywords } from '../transform';

export const fetchKeywords = async (client: TypedSupabaseClient, orgId: string) => {
  const { data } = await client.from('tag_keywords')
  .select('*')
  .eq('org_id', orgId)
  .throwOnError();

  return data;
};

export const fetchKeyword = async (client: TypedSupabaseClient, id: string) => {
  const { data } = await client.from('tag_keywords')
  .select('*')
  .eq('id', id)
  .throwOnError();

  return data;
};

export const fetchTagKeywords = async (client: TypedSupabaseClient, id: string) => {
  const { data } = await client.from('tags_keywords')
  .select('tag_keywords(*)')
  .eq('tag_id', id)
  .throwOnError();

  return tagKeywordsToKeywords(data);
};