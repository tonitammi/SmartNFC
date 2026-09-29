import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptInvitation, deleteInvitation, sendOrgInvitation, setInvitationStatus } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { OrganizationInvitationKeys } from '../queries/queryKeys';
import type { InsertOrganizationInvitation, InvitationStatus } from '../types';

export type UseInvitationMutationsProps = {
  orgId: string | null;
  userEmail?: string | null;
}

export const useInvitationMutations = ({ orgId, userEmail } : UseInvitationMutationsProps) => {
  const queryClient = useQueryClient();

  
  const statusMutation = useMutation({
    mutationFn: ({ 
      id, 
      status,
    } : { 
      id: string; 
      status: InvitationStatus; 
    }) => setInvitationStatus(supabase, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OrganizationInvitationKeys.invitations, 'own', userEmail],
      });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (invitationId: string) => acceptInvitation(supabase, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OrganizationInvitationKeys.invitations, 'own', userEmail],
      });
      queryClient.invalidateQueries({
        queryKey: [OrganizationInvitationKeys.invitations, 'own', userEmail, 'pending'],
      });
    },
  });

  const insertMutation = useMutation({
    mutationFn: (
      invitation: InsertOrganizationInvitation
    ) => sendOrgInvitation(supabase, invitation),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OrganizationInvitationKeys.invitations, 'organization', orgId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInvitation(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OrganizationInvitationKeys.invitations, 'organization', orgId],
      });
    },
  });

  return {
    statusMutation,
    acceptMutation,
    insertMutation,
    deleteMutation,
  };
};
