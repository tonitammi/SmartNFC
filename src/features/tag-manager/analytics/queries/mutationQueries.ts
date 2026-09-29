import { supabase } from '@/src/lib/supabase/supabaseClient';
import { getParsedUserAgent, isLoggedScan, saveLogScanEvent } from '../utils';

export interface CreateNFCScanLogEventParams {
  nfcTagId: string;
  orgId: string;
};

export const createNFCScanLogEntry = async ({ nfcTagId, orgId }: CreateNFCScanLogEventParams) => {
  
  if (isLoggedScan(nfcTagId)) return;

  const { data } = await supabase.auth.getUser();
  
  const scanLogEntry = {
    nfc_tag_id: nfcTagId,
    org_id: orgId,
    scan_details: JSON.stringify({
      ...getParsedUserAgent(),
      is_authenticated: !!data.user,
      user_id: data.user?.id, 
      user: data.user, 
    }),
  };

  try {
    await supabase
    .from('nfc_scan_logs')
    .insert(scanLogEntry);

    saveLogScanEvent(nfcTagId);

  } catch(err) {
    console.log(err);
  }
};