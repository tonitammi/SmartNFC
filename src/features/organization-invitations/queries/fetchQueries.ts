import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';

export const fetchOwnPendingInvitations = async (
  client: TypedSupabaseClient, 
  userEmail: string
) => {
  const { data } = await client
  .from('organization_invitations')
  .select('id, org_id, org_name, inviter_email, email, role, token, status, expires_at')
  .eq('email', userEmail)
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
  .throwOnError();

  return data;
};

export type FetchOwnInvitationsOptions = {
  include: {
    onlyPending?: boolean;
    declined?: boolean;
    expired?: boolean;
  }
}

export const fetchOwnInvitations = async (
  client: TypedSupabaseClient, 
  userEmail: string,
  options?: FetchOwnInvitationsOptions
) => {
  console.log('options', options);

  const createQuery = () => { 
    const baseQuery = client
    .from('organization_invitations')
    .select('id, org_id, org_name, inviter_email, email, role, token, status, user_notified, expires_at')
    .eq('email', userEmail);

    if (!options?.include.expired) {
      console.log('if (!options?.include.expired)');
      baseQuery.gt('expires_at', new Date().toISOString());
    }

    if (options?.include.onlyPending) {
      console.log('if (options?.include.onlyPending)');
      baseQuery.eq('status', 'pending');
    } else {
      console.log('if (options?.include.onlyPending) -> ELSE');
      if (options?.include.declined) {
        console.log('if (options?.include.declined)');
        baseQuery.eq('status', 'accepted').or('pending').or('declined');
      } else {
        console.log('if (options?.include.declined) -> ELSE');
        baseQuery.eq('status', 'accepted').or('pending');
      }
    }

    baseQuery  
    .order('created_at', { ascending: false })
    .throwOnError();

    return baseQuery;
  };

  const { data } = await createQuery();

  console.log('fetchOwnInvitations data', data);

  return data;
};

export const fetchSentInvitationsByOrganization = async (
  client: TypedSupabaseClient, 
  orgId: string
) => {
  const { data } = await client
  .from('organization_invitations')
  .select('*')
  .eq('org_id', orgId)
  .order('created_at', { ascending: false })
  .throwOnError();

  return data;
};

export const fetchOwnInvitationsCount = async (
  client: TypedSupabaseClient, 
  userEmail: string
) => {
  console.log('fetchOwnInvitationsCount');
  const { data, count } = await client
  .from('organization_invitations')
  .select('id', { count: 'exact' })
  .eq('email', userEmail)
  .eq('status', 'pending')
  .gt('expires_at', new Date().toISOString())
  .order('created_at', { ascending: false })
  .throwOnError();

  console.log('data', data);
  console.log('count', count);

  return count;
};

export const fetchSentInvitations = async (
  client: TypedSupabaseClient, 
  userId: string
) => {
  const { data } = await client
  .from('organization_invitations')
  .select('*')
  .eq('invited_by', userId)
  .order('created_at', { ascending: false })
  .throwOnError();

  return data;
};