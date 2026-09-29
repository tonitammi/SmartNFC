import { useQuery } from '@tanstack/react-query';
import { OrgQueryKeys } from '../queries/queryKeys';
import { fetchUserOrganization } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useOrganizationQuery = (params: { 
  orgId: string;
  userId: string; 
}) => {
  const { orgId, userId } = params;
  const query = useQuery({
    queryKey: [OrgQueryKeys.organizations, userId, orgId],
    queryFn: () => fetchUserOrganization(supabase, { orgId, userId }),
    enabled: !!userId && !!orgId, 
  });

  return query;
};