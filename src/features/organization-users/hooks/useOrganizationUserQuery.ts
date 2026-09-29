import { useQuery } from '@tanstack/react-query';
import { OrgUserQueryKeys } from '../queries/queryKeys';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { fetchOrganizationUser } from '../queries/fetchQueries';

export const useOrganizationsUserQuery = (orgId: string, userId: string) => {
  const query = useQuery({
    queryKey: [OrgUserQueryKeys.organizationUsers, orgId, userId],
    queryFn: () => fetchOrganizationUser(supabase, { orgId, userId }),
  });

  return query;
};