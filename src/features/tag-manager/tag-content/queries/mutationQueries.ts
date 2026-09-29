import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { TagContent, TagContentAssignment } from '../types';
import type { InsertContentEntry } from '../../content/types';
import { createContentEntry } from '../../content/queries/mutationQueries';

export type AssignContentParams = { 
  tagId: string; 
  contentId: string; 
}

export type CreateAndAssignParams = {
  tagId: string;
  content: InsertContentEntry;
}

export const createAndAssignContent = async (
  client: TypedSupabaseClient, 
  { tagId, content }: CreateAndAssignParams
): Promise<TagContent> => {

  const contentEntry = await createContentEntry(client, { 
    contentEntry: content, 
  });

  await client
      .from('tag_content_assignments')
      .insert({ tag_id: tagId, content_id: contentEntry.id })
      .single()
      .throwOnError();

  return {
    tag_id: tagId,
    content: contentEntry,
  };
};


export const assignContentToTag = async (
  client: TypedSupabaseClient, 
  { tagId, contentId }: AssignContentParams
): Promise<TagContent> => {
  const { data } = await client
      .from('tag_content_assignments')
      .insert({ tag_id: tagId, content_id: contentId })
      .select('content_entry:content_entries (*)')
      .single()
      .throwOnError();

  return {
    tag_id: tagId,
    content: data.content_entry,
  };
};

export const unassignContentFromTag = async (
  client: TypedSupabaseClient,
  { tagId, contentId } : AssignContentParams
): Promise<TagContentAssignment> => {

  const { data } =  await client
      .from('tag_content_assignments')
      .delete()
      .eq('tag_id', tagId)
      .eq('content_id', contentId)
      .select('*')
      .single()
      .throwOnError();

  return data;
};
