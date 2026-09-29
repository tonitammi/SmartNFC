import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { Tag } from '../types';

export const fetchTags = async (
  client: TypedSupabaseClient, 
  { orgId } : { orgId: string }
): Promise<Tag[]> => {
  const { data } = await client.from('tags')
        .select('*')
        .eq('org_id', orgId)
        .throwOnError();
  return data;
};

export const fetchTag = async (
  client: TypedSupabaseClient, 
  { orgId, tagId } : { orgId: string, tagId: string; }
): Promise<Tag> => {
  const { data } = await client.from('tags')
        .select('*')
        .eq('id', tagId)
        .eq('org_id', orgId)
        .single()
        .throwOnError();

  return data;
};

export const fetchTagCount = async (
  client: TypedSupabaseClient, 
  { orgId }: { orgId: string }
): Promise<{ 
  count: number; 
  status: number; 
  statusText: string; 
}> => {
  const response = await client.from('tags') 
        .select('*', { 
          head: true,
          count: 'exact', 
        })
        .eq('org_id', orgId)
        .throwOnError() as { 
          count: number; 
          status: number; 
          statusText: string; 
        };

  return response;
};
