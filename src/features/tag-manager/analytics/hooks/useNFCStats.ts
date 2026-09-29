import { useQuery } from '@tanstack/react-query';
import { AnalyticsQueryKeys } from '../queries/queryKeys';
import { fetchNFCTagStats } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export type UseNFCAnalyticsParams = {
  orgId: string;
  limit?: number;
};

export const useNFCStats = ({ 
  orgId,
  limit = 10,
} : UseNFCAnalyticsParams) => {
  const query = useQuery({
    queryKey: [AnalyticsQueryKeys.nfcTagDetails, orgId, limit],
    queryFn: () => fetchNFCTagStats(supabase, { orgId, limit }),
  });

  return query;
};