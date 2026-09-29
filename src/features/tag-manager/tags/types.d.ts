import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

export type Tag = SupabaseDatabase['public']['Tables']['tags']['Row'];
export type TagRelations = SupabaseDatabase['public']['Tables']['tags']['Relationships'];
export type InsertTag = Omit<SupabaseDatabase['public']['Tables']['tags']['Insert'], 'id'>;
export type UpdateTag = Omit<SupabaseDatabase['public']['Tables']['tags']['Update'], 'id'>;

export type TagFormData = Pick<Tag, 'label' | 'address' | 'building' | 'floor' | 'room' | 'specific_location' | 'folder_id'>


