import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { InsertOrganizationInvitation, InvitationStatus, OrganizationInvitation } from '../types';

export const sendOrgInvitation = async (
  client: TypedSupabaseClient, 
  invitation: InsertOrganizationInvitation
) => {
  const { data } = await client
  .from('organization_invitations')
  .insert(invitation)
  .select('org_id, org_name, inviter_email, email, role, token, status, expires_at')
  .single()
  .throwOnError();

  return data;
};

export const deleteInvitation = async (
  client: TypedSupabaseClient, 
  id: string
) => {
  const { data } = await client
  .from('organization_invitations')
  .delete()
  .eq('id', id)
  .select('*')
  .single()
  .throwOnError();

  return data;
};


export const acceptInvitation = async (
  client: TypedSupabaseClient, 
  invitationId: string
) => {
  const res = await client
  .rpc('accept_invitation', {
    invitation_id: invitationId,
  })
  .throwOnError();

  console.log('acceptInvitation res', res);

  return { id: invitationId };
};



export const setInvitationStatus = async (
  client: TypedSupabaseClient, 
  invitationId: string,
  status: OrganizationInvitation['status'] & InvitationStatus
) => {
  const res = await client
  .rpc('set_invitation_status', {
    invitation_id: invitationId,
    new_status: status,
  })
  .throwOnError();

  console.log('acceptInvitation res', res);

  return { id: invitationId };
};