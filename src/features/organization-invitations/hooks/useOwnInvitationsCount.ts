import { useQuery } from '@tanstack/react-query';
import { OrganizationInvitationKeys } from '../queries/queryKeys';
import { fetchOwnInvitationsCount } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';


export const useOwnInvitationsCount = (email?: string) => {
  const keys = [OrganizationInvitationKeys.invitationsCount, 'own'];

  const query = useQuery({
    queryKey: keys,
    queryFn: () => {
      if (email) {
        return fetchOwnInvitationsCount(supabase, email);
      }
      return null;
    },
    enabled: !!email,
    refetchInterval: 40_000, // every 40 sec 
    refetchIntervalInBackground: false,
  });

  return query;
};