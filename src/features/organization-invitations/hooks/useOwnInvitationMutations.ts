import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptInvitation, setInvitationStatus } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { OrganizationInvitationKeys } from '../queries/queryKeys';
import type { InvitationStatus } from '../types';

export type useOwnInvitationMutationsProps = {
  userEmail?: string | null;
}

export const useOwnInvitationMutations = (
    { userEmail } : useOwnInvitationMutationsProps
) => {
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
  return {
    statusMutation,
    acceptMutation,
  };
};
