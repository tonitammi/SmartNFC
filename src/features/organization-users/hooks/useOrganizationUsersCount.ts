import { useQuery } from '@tanstack/react-query';
import { OrgUserQueryKeys } from '../queries/queryKeys';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { fetchOrganizationUsersCount } from '../queries/fetchQueries';

export const useOrganizationsUsersCount = (params: { orgId: string | null }) => {
  const { orgId } = params;

  const query = useQuery({
    queryKey: [OrgUserQueryKeys.organizationUsers, orgId, 'count'],
    queryFn: () => orgId ? fetchOrganizationUsersCount(supabase, { orgId }) : { count: 0 },
    enabled: !!orgId,
  });

  return query;
};