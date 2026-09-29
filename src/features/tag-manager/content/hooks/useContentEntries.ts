import { useQuery } from '@tanstack/react-query';
import { ContentQueryKeys } from '../queries/queryKeys';
import { fetchOrganizationContentEntries } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useContentEntries = (orgId: string) => {
  const query = useQuery({
    queryKey: [ContentQueryKeys.contentEntries, orgId],
    queryFn: () => fetchOrganizationContentEntries(supabase, { orgId }),
    enabled: !!orgId,
  });

  return query;
};