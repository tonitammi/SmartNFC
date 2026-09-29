import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { InsertOrganization, UpdateOrganization, UserOrganization } from '../types';
import { fetchUserOrganization } from './fetchQueries';

export const createOrganization = async (
  client: TypedSupabaseClient, 
  { organization }: { organization: InsertOrganization }
): Promise<UserOrganization> => {
  const { name, display_name = null } = organization;
  const { data: { id, owner_id } } = await client.rpc('create_organization_with_admin', {
        org_name: name,
        org_display_name: display_name || name,
      })
      .single()
      .throwOnError();

  return await fetchUserOrganization(client, {
    orgId: id,
    userId: owner_id!,
  }) as UserOrganization;
};

export const updateOrganization = async (
  client: TypedSupabaseClient, 
  { orgId, userId, organization }: { orgId: string, userId: string, organization: UpdateOrganization, }
): Promise<UserOrganization> => {  
  await client.from('organizations')
        .update(organization)
        .eq('id', orgId)
        .single()
        .throwOnError();

  return await fetchUserOrganization(client, {
    orgId,
    userId,
  }) as UserOrganization;
};


export const deleteOrganization = async (
  client: TypedSupabaseClient, 
  { orgId, userId }: { orgId: string, userId: string;}
): Promise<{ id: string, user_id: string }> => {  
  await client.from('organizations')
        .delete()
        .eq('id', orgId)
        .eq('owner_id', userId)
        .select('*')
        .single()
        .throwOnError();

  return { id: orgId, user_id: userId };
};