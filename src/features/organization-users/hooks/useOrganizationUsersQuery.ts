import { useQuery } from '@tanstack/react-query';
import { OrgUserQueryKeys } from '../queries/queryKeys';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { fetchOrganizationUsers } from '../queries/fetchQueries';

export const useOrganizationsUsersQuery = (orgId: string | null) => {
  const query = useQuery({
    queryKey: [OrgUserQueryKeys.organizationUsers, orgId],
    queryFn: () => orgId ? fetchOrganizationUsers(supabase, { orgId }) : [],
    enabled: !!orgId,
  });

  return query;
};