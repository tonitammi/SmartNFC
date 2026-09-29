import { useQuery } from '@tanstack/react-query';
import { TagContentQueryKeys } from '../queries/queryKeys';
import { fetchTagContentEntries } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export type UseTagContentEntriesParams = { 
  orgId: string | null; 
  tagId: string | null; 
};

export const useTagContentEntries = ({ orgId, tagId } : UseTagContentEntriesParams) => {
  const query = useQuery({
    queryKey: [TagContentQueryKeys.tagContentAssignments, orgId, tagId],
    queryFn: async () => {
      await supabase.auth.getSession();

      if (orgId && tagId) {
        return fetchTagContentEntries(supabase, { tagId });
      }
      return [];
    },
    enabled: !!tagId && !!orgId,
  });

  return query;
};