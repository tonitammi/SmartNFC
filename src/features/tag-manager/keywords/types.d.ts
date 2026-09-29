import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

export type Keyword = SupabaseDatabase['public']['Tables']['tag_keywords']['Row'];
export type UpdateKeyword = SupabaseDatabase['public']['Tables']['tag_keywords']['Update'];
type InsertKeyword = SupabaseDatabase['public']['Tables']['tag_keywords']['Insert'];

export interface InsertKeyword extends InsertKeyword{
    org_id: string;
};

