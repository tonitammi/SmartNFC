import { useMutation } from '@tanstack/react-query';
import { createTagNfcTag, deleteTagNfcTag, type DeleteTagNfcTagParams } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import type { InsertTagNfcTag } from '../types';

export const useTagNfcTagMutations = () => {
  const insertMutation = useMutation({
    mutationFn: (tagNfcTag: InsertTagNfcTag) => 
      createTagNfcTag(supabase, tagNfcTag),
  });
  const deleteMutation = useMutation({
    mutationFn: (params: DeleteTagNfcTagParams) => 
      deleteTagNfcTag(supabase, params),
  });

  return {
    insertMutation,
    deleteMutation,
  };
};