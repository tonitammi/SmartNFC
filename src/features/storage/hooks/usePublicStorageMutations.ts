import { useMutation } from '@tanstack/react-query';
import { uploadFile, type UploadFileParams } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';


export const usePublicStorageMutations = (orgId: string) => {
  const insertMutation = useMutation({
    mutationKey: ['upload_file', orgId],
    mutationFn: (params: Omit<UploadFileParams, 'orgId'>) => 
      uploadFile(supabase, {...params, orgId}),
  });

  return insertMutation;
};