import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { OrganizationsUserWithOwner } from '../types';

export const fetchOrganizationUsers = 
async (client: TypedSupabaseClient, params: { 
  orgId: string; 
}): Promise<OrganizationsUserWithOwner[]> => {
  const { orgId } = params;
  const { data } = await client.from('organization_users')
        .select('*, organization:organizations(owner_id)')
        .eq('org_id', orgId)
        .throwOnError();
  return data;
};

export const fetchOrganizationUser = async (
  client: TypedSupabaseClient, 
  { orgId, userId }: { orgId: string; userId: string; }
): Promise<OrganizationsUserWithOwner> => {
  const { data } = await client.from('organization_users')
        .select('*, organization:organizations(owner_id)')
        .eq('org_id', orgId)
        .eq('user_id', userId)
        .single()
        .throwOnError();

  return data;
};


export const fetchOrganizationUsersCount = async (
  client: TypedSupabaseClient, 
  { orgId }: { orgId: string }
): Promise<{ 
  count: number; 
  status: number; 
  statusText: string; 
}> => {
  const response = await client.from('organization_users') 
        .select('*', { 
          head: true,
          count: 'exact', 
        })
        .eq('org_id', orgId)
        .throwOnError() as { 
          count: number; 
          status: number; 
          statusText: string; 
        };;

  return response;
};