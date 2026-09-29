import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { InsertKeyword, Keyword } from '../types';

export const upsertKeyword = async (
  client: TypedSupabaseClient, 
  keyword: InsertKeyword
) => {
  const { data } = await client.from('tag_keywords')
  .upsert(keyword)
  .select('*')
  .single()
  .throwOnError();

  return data;
};

export const deleteKeyword = async (
  client: TypedSupabaseClient, 
  id: string
) => {
  const { data } = await client.from('tag_keywords')
  .delete()
  .eq('id', id)
  .select('*')
  .single()
  .throwOnError();

  return data;
};

export type UpsertTagKeywordsParams = {
  tagId: string;
  keywords: Keyword[]; 
};

export const upsertTagKeywords = async (
  client: TypedSupabaseClient,
  { tagId, keywords } : UpsertTagKeywordsParams
) => {
  const tagsKeywords =  keywords.map(({ id }) => (
    { keyword_id: id, tag_id: tagId }
  ));
  const { data } = await client.from('tags_keywords')
  .upsert(tagsKeywords, { ignoreDuplicates: true })
  .select('*')
  .throwOnError();

  return data;
};

export type DeleteTagKeywordParams = {
  tagId: string;
  keywordId: string;
}

export const deleteTagKeyword = async (
  client: TypedSupabaseClient,
  { tagId, keywordId } : DeleteTagKeywordParams
) => {
  const { data } = await client.from('tags_keywords')
  .delete()
  .eq('tag_id', tagId)
  .eq('keyword_id', keywordId)
  .select('*')
  .single()
  .throwOnError();

  return data;
};