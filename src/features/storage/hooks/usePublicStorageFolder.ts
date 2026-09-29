import { useQuery } from '@tanstack/react-query';
import type { PublicStorageFolder } from '../types';
import { StorageQueryKeys } from '../queries/queryKeys';
import { getPublicStorageBucketFolderFilesWithUrl } from '../queries/fetchQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export interface usePublicStorageFolderParams {
  orgId: string;
  folder: PublicStorageFolder;
}

export const usePublicStorageFolder = (
  { orgId, folder } : usePublicStorageFolderParams
) => {
  const query = useQuery({
    queryKey: [StorageQueryKeys.publicStorage, orgId, folder],
    queryFn: () => getPublicStorageBucketFolderFilesWithUrl(supabase, { orgId, folder }) || [],
  });

  return query;
};