import { useQuery } from '@tanstack/react-query';
import { ContentQueryKeys } from '../queries/queryKeys';
import { fetchContentEntryTags } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export interface UseContentEntryProps {
  orgId: string;
  contentId: string | null;
};

export const useContentEntryTags = ({ orgId, contentId } : UseContentEntryProps) => {
  const query = useQuery({
    queryKey: [ContentQueryKeys.contentEntryTags, orgId, contentId],
    queryFn: () => {
      if (contentId) return fetchContentEntryTags(supabase, { contentId });
      return [];
    },
    enabled: !!contentId,
  });

  return query;
};