import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { UserOrganization } from '../types';
import { toUserOrganization } from '../transform';

export const fetchUserOrganizations = async (
  client: TypedSupabaseClient, 
  { userId }: {  userId: string }
): Promise<UserOrganization[]> => {
  
  const { data } = await client.from('organization_users')
        .select(`
          role,
          organization:organizations (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { 
          ascending: false, 
          nullsFirst: false, 
        })
        .throwOnError();

  return (data).map((item) => (
    toUserOrganization(item, userId)
  )).filter(x => x !== null);
};

export const fetchUserOrganization = async (
  client: TypedSupabaseClient, 
  { orgId, userId }: { orgId: string, userId: string }
): Promise<UserOrganization | null> => {

  const { data } = await client.from('organization_users')
        .select(`
          role,
          organization:organizations (*)
        `)
        .eq('org_id', orgId)
        .eq('user_id', userId)
        .single()
        .throwOnError();

  return toUserOrganization(data, userId);
};