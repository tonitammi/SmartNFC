import type { TypedSupabaseClient } from '@/src/lib/supabase/supabaseClient';
import type { PublicStorageFolder, StorageFileObject } from '../types';
import { getFileUrl } from '../utils';

export const getPublicStorageBucketFolderFilesWithUrl = async (
    client: TypedSupabaseClient,
    { orgId, folder } : {
      orgId: string, 
      folder: PublicStorageFolder,
    }
): Promise<null | StorageFileObject[]> => {
  const { data } = await client.storage
        .from('public_media')
        .throwOnError()
        .list(`${orgId}/${folder}`);

  return !data ? data : data.map((fileObj) => ({
    ...fileObj,
    publicUrl: getFileUrl(`${orgId}/${folder}/${fileObj.name}`),
  }));
};

export const getBucketFolderFilesWithUrl = async (
  client: TypedSupabaseClient,
  { bucket, folder } : { 
    bucket: string, 
    folder: string,
  }
) => {
    const { data } = await client.storage
          .from(bucket)
          .throwOnError()
          .list(folder);

  return !data ? data : data.map((fileObj) => ({
    ...fileObj,
    publicUrl: getFileUrl(`${folder}/${fileObj.name}`),
  }));
};

export const getBuckerFolders = async (  
  client: TypedSupabaseClient,
  { bucket } : { 
    bucket: string, 
  }
) => {
  const { data } = await client.storage
        .from(bucket)
        .throwOnError()
        .list();
  return data;
};