import { useQuery } from '@tanstack/react-query';
import { AnalyticsQueryKeys } from '../queries/queryKeys';
import { fetchWeekScans } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useScanWeekStats = (orgId: string) => {
  const query = useQuery({
    queryKey: [AnalyticsQueryKeys.weekStats, orgId],
    queryFn: () => fetchWeekScans(supabase, orgId),
  });

  return query;
};