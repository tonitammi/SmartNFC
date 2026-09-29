import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import { toISOString } from '@/src/utils/datetime';

export const getNFCScanLogEntries = async (
  client: TypedSupabaseClient, 
  nfcTagId: string
) => {
  const { data } = await client
  .from('nfc_scan_logs')
  .select('*, tag_nfc_tags!inner(*)')
  .eq('tag_nfc_tags.tag_id', nfcTagId)
  .throwOnError();

  return data;
};


export const fetchNFCTagDetails = async (
  client: TypedSupabaseClient, 
  orgId: string,
  limit: number = 10
) => {
  const { data } = await client
  .from('tag_nfc_tags')
  .select('nfc_tag_id, tag_id, org_id, last_scan, scan_count')
  .eq('org_id', orgId)
  .order('last_scanned_at', { ascending: false })
  .limit(limit)
  .throwOnError();

  return data;
};


type FetchNFCTagDetailsBetweenScanDatesParams = {
  orgId: string;
  startDate: number | string | Date;
  endDate: number | string | Date;
};
export const fetchNFCTagDetailsBetweenScanDates = async (
  client: TypedSupabaseClient, 
  params: FetchNFCTagDetailsBetweenScanDatesParams
) => {
  const { orgId, ...rest } = params;
  const start = toISOString(rest.startDate);
  const end = toISOString(rest.endDate);

  const { data } = await client
  .from('tag_nfc_tags')
  .select('nfc_tag_id, tag_id, org_id, last_scan, scan_count')
  .eq('org_id', orgId)
  .gt('last_scanned_at', start)
  .lt('last_scanned_at', end)
  .order('last_scanned_at', { ascending: false })
  .throwOnError();

  return data;
};

export type FetchNFCTagStatsParams = {
  orgId: string;
  limit?: number;
}

export const fetchNFCTagStats = async (
  client: TypedSupabaseClient, 
  {
    orgId,
    limit = 5,
  } : FetchNFCTagStatsParams
) => {
  const { data } = await client
  .rpc('get_tag_stats_by_org', { 
    p_org_id: orgId, 
    p_limit: limit,
  })
  .throwOnError();

  return data;
};

export const fetchDayScans = async (
  client: TypedSupabaseClient, 
  orgId: string
) => {
  const { data } = await client
  .rpc('get_scans_per_hour', { 
    p_org_id: orgId, 
  })
  .throwOnError();
  console.log('fetchDayScans data', data);
  return data;
};

export const fetchWeekScans = async (
  client: TypedSupabaseClient, 
  orgId: string
) => {
  const { data } = await client
  .rpc('get_scans_per_day', { 
    p_org_id: orgId, 
  })
  .throwOnError();

  console.log('fetchWeekScans data', data);

  return data;
};