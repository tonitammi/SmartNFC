import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

export type NFCScanLog = SupabaseDatabase['public']['Tables']['nfc_scan_logs']['Row'];
export type InsertNFCScanLog = SupabaseDatabase['public']['Tables']['nfc_scan_logs']['Insert'];