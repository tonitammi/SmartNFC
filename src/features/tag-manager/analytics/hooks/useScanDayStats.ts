import { useQuery } from '@tanstack/react-query';
import { AnalyticsQueryKeys } from '../queries/queryKeys';
import { fetchDayScans } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useScanDayStats = (orgId: string) => {
  const query = useQuery({
    queryKey: [AnalyticsQueryKeys.dayStats, orgId],
    queryFn: () => fetchDayScans(supabase, orgId), 
  });

  return query;
};