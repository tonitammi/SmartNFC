import { useQuery } from '@tanstack/react-query';
import { ContentQueryKeys } from '../queries/queryKeys';
import { fetchOrganizationContentEntry } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export interface UseContentEntryProps {
  orgId: string;
  contentId: string | null;
};

export const useContentEntry = ({ orgId, contentId } : UseContentEntryProps) => {
  const query = useQuery({
    queryKey: [ContentQueryKeys.contentEntries, orgId, contentId],
    queryFn: () => {
      if (contentId) return fetchOrganizationContentEntry(supabase, { orgId, contentId });
      return null;
    },
    enabled: !!contentId,
  });

  return query;
};