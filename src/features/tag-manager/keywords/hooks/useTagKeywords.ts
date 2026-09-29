import { useQuery } from '@tanstack/react-query';
import { KeywordQueryKeys } from '../queries/queryKeys';
import { fetchTagKeywords } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useTagKeywords = (tagId: string | null) => {
  const query = useQuery({
    queryKey: [KeywordQueryKeys.tagKeywords, tagId],
    queryFn: () => tagId ? fetchTagKeywords(supabase, tagId) : [],
    enabled: !!tagId,
  });

  return query;
};