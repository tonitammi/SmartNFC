import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import { getFileUrl, sanitizeFilename } from '../utils';
import type { SupabaseFileOptions } from '../types';

const defaultUploadOptions: SupabaseFileOptions = {
  cacheControl: '7200',
  upsert: false,
};

export interface UploadFileParams {  
  file: File,
  filename: string;
  folder: string;
  orgId: string;
  options?: SupabaseFileOptions;
}

export const uploadFile = async (
  client: TypedSupabaseClient,
  {
    file,
    filename,
    folder,
    orgId,
    options = defaultUploadOptions,
  } : UploadFileParams
) => {

  const { data } = await client.storage
        .from('public_media')
        .throwOnError()
        .upload(`${orgId}/${folder}/${sanitizeFilename(filename)}`, file, options);

  if (!data) return null;
  
  return {
    ...data,
    publicUrl: getFileUrl(data?.path),
  };
};