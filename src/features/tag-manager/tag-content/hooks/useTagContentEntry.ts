import { useQuery } from '@tanstack/react-query';
import { TagContentQueryKeys } from '../queries/queryKeys';
import { fetchTagContentEntry } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export type UseTagContentEntryParams = {
  orgId: string;
  tagId: string | null;
  contentId: string | null; 
}
export const useTagContentEntry = ({ orgId, tagId, contentId } : UseTagContentEntryParams) => {
  const query = useQuery({
    queryKey: [TagContentQueryKeys.tagContentAssignments, orgId, tagId],
    queryFn: () => tagId && contentId ? fetchTagContentEntry(supabase, { tagId, contentId }) : null,
    enabled: !!tagId && !!contentId,
  });

  return query;
};