import { useQuery } from '@tanstack/react-query';
import { OrgQueryKeys } from '../queries/queryKeys';
import { fetchUserOrganizations } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useOrganizationsQuery = (params: {userId: string | null | undefined }) => {
  const {  userId } = params;

  const query = useQuery({
    queryKey: [OrgQueryKeys.organizations, userId],
    queryFn: () => userId ? fetchUserOrganizations(supabase, { userId }) : [],
    enabled: !!userId,
  });

  return query;
};