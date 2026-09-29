import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { KeywordQueryKeys } from '../queries/queryKeys';
import type { InsertKeyword } from '../types';
import { deleteKeyword, upsertKeyword } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';

export const useKeywordMutations = (orgId: string) => {
  const queryClient = useQueryClient();

  const invalidate = useCallback((keywordId: string) => {
    const queryKey = [KeywordQueryKeys.keywords, orgId];
    if (keywordId) queryKey.push(keywordId);
  
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, orgId]);

  const upsertMutation = useMutation({
    mutationFn: (keyword: InsertKeyword) => 
      upsertKeyword(supabase, keyword),
    onSuccess: (({ id }) => invalidate(id)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      deleteKeyword(supabase, id),
    onSuccess: (({ id }) => invalidate(id)),
  });

  return {
    upsertMutation,
    deleteMutation,
  };
};