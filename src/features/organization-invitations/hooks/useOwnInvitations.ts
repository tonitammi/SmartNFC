import { useQuery } from '@tanstack/react-query';
import { OrganizationInvitationKeys } from '../queries/queryKeys';
import { fetchOwnInvitations, type FetchOwnInvitationsOptions } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';


export const useOwnInvitations = (
  email?: string, 
  options? : FetchOwnInvitationsOptions
) => {
  const keys = [OrganizationInvitationKeys.invitations, 'own', email];
  if (options?.include?.onlyPending) keys.push('onlyPending');
  if (options?.include?.expired) keys.push('expired');
  if (options?.include?.declined) keys.push('declined');

  const query = useQuery({
    queryKey: keys,
    queryFn: () => {
      if (email) {
        return fetchOwnInvitations(supabase, email, options);
      }
      return [];
    },
    enabled: !!email,
  });

  return query;
};