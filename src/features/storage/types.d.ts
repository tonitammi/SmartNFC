import { supabase } from '@/src/lib/supabase/supabaseClient';

export type PublicStorageFolder = 'audio' | 'image' | 'video' | 'document';
export type SupabaseStorageFrom = ReturnType<Awaited<typeof supabase.storage.from>>;
export type UploadFuncParameters = Parameters<SupabaseStorageFrom['upload']>;
export type SupabaseFileOptions = NonNullable<UploadFuncParameters[2]>;
export type SupabaseFileObject = NonNullable<Awaited<ReturnType<SupabaseStorageFrom['list']>>['data']>[0];

export interface StorageFileObject extends SupabaseFileObject {
    publicUrl: string;
}
