import { useQuery } from '@tanstack/react-query';
import { TagQueryKeys } from '../queries/queryKeys';
import { fetchTag } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useTagQuery = (
  { tagId, orgId }: { 
      tagId: string | null;
      orgId: string | null | undefined; 
  }
) => {

  const query = useQuery({
    queryKey: [TagQueryKeys.tags, orgId, tagId],
    queryFn: () => orgId && tagId ? fetchTag(supabase, { tagId, orgId }) : null,
    enabled: !!orgId && !!tagId,
  });

  return query;
};