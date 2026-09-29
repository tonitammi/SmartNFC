import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

export type TagNfcTag = SupabaseDatabase['public']['Tables']['tag_nfc_tags']['Row'];
export type InsertTagNfcTag = SupabaseDatabase['public']['Tables']['tag_nfc_tags']['Insert'];
export type UpdateTagNfcTag = SupabaseDatabase['public']['Tables']['tag_nfc_tags']['Update'];