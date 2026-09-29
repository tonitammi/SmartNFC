import { useQuery } from '@tanstack/react-query';
import { TagQueryKeys } from '../queries/queryKeys';
import { fetchTags } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useTagsQuery = ({ orgId }: {orgId: string | null | undefined }) => {

  const query = useQuery({
    queryKey: [TagQueryKeys.tags, orgId],
    queryFn: () => orgId ? fetchTags(supabase, { orgId }) : [],
    enabled: !!orgId,
  });

  return query;
};