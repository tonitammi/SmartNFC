import { useQuery } from '@tanstack/react-query';
import { KeywordQueryKeys } from '../queries/queryKeys';
import { fetchKeywords } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useKeywords = (orgId: string | null) => {
  const query = useQuery({
    queryKey: [KeywordQueryKeys.keywords, orgId],
    queryFn: () => orgId ? fetchKeywords(supabase, orgId) : [],
    enabled: !!orgId,
  });

  return query;
};