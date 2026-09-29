import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { InsertOrganizationUser, UpdateOrganizationUser, OrganizationUser } from '../types';

export const createOrganizationUser = async (
  client: TypedSupabaseClient, 
  { user }: { user: InsertOrganizationUser }
): Promise<OrganizationUser> => {
  const { data } = await client.from('organization_users')
        .insert(user)
        .select('*')
        .single()
        .throwOnError();

  return data;
};

export const updateOrganizationUser = async (
  client: TypedSupabaseClient, 
  { userId, user } :{ userId: string, user: UpdateOrganizationUser }
): Promise<OrganizationUser> => {
  const { data } = await client.from('organization_users')
        .update(user)
        .eq('user_id', userId)
        .select('*')
        .single()
        .throwOnError();
  return data;
};

export const deleteOrganizationUser = async (
  client: TypedSupabaseClient, 
  { userId } : { userId: string }
): Promise<OrganizationUser> => {
  const { data } = await client.from('organization_users')
        .delete()
        .eq('user_id', userId)
        .select('*')
        .single()
        .throwOnError();
  return data;
};