import { useQuery } from '@tanstack/react-query';
import { TagNfcTagsQueryKeys } from '../queries/queryKeys';
import { fetchTagNfcTags } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useTagNfcTags = (tagId: string | null) => {
  const query = useQuery({
    queryKey: [TagNfcTagsQueryKeys.nfcTags],
    queryFn: () => tagId ? fetchTagNfcTags(supabase, { tagId }) : [],
    enabled: !!tagId,
  });

  return query;
};