import { useQuery } from '@tanstack/react-query';
import { OrganizationInvitationKeys } from '../queries/queryKeys';
import { fetchSentInvitationsByOrganization } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useSentInvitationsByOrg = (orgId: string) => {
  const query = useQuery({
    queryKey: [OrganizationInvitationKeys.invitations, 'organization', orgId],
    queryFn: () => {
      if (orgId) {
        return fetchSentInvitationsByOrganization(supabase, orgId);
      }
      return [];
    },
    enabled: !!orgId,
  });

  return query;
};