import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { KeywordQueryKeys } from '../queries/queryKeys';
import { deleteTagKeyword, upsertTagKeywords, type DeleteTagKeywordParams, type UpsertTagKeywordsParams } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useTagKeywordMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = useCallback((id?: string) => {
    const queryKey = [KeywordQueryKeys.tagKeywords];
    if (id) queryKey.push(id);
  
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  const addMutation = useMutation({
    mutationFn: (params: UpsertTagKeywordsParams) => 
      upsertTagKeywords(supabase, params),
    onSuccess: (() => invalidate()),
  });

  const deleteMutation = useMutation({
    mutationFn: (params: DeleteTagKeywordParams) => 
      deleteTagKeyword(supabase, params),
    onSuccess: (({ tag_id }) => invalidate(tag_id)),
  });

  return {
    addMutation,
    deleteMutation,
  };
};