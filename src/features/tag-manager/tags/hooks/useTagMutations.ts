import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TagQueryKeys } from '../queries/queryKeys';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { createTag, deleteTag, updateTag } from '../queries/mutationQueries';
import { useCallback } from 'react';
import type { InsertTag, UpdateTag } from '../types';

export const useTagMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = useCallback(async (
    { orgId, tagId }: { orgId: string, tagId?: string;  }
  ) => {
      const queryKey = [TagQueryKeys.tags, orgId];
      if (tagId) queryKey.push(tagId);
    
      return queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  const insertMutation = useMutation({
    mutationFn: ({ tag } : { tag: InsertTag }) => createTag(supabase, { tag }),
    onSuccess: async ({ org_id: orgId }) => {
      if (!orgId) return;
      await invalidate({ orgId });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ tagId, tag }: { tagId: string, tag: UpdateTag }) => (
      updateTag(supabase, { tagId, tag })
    ),
    onSuccess: async ({ org_id: orgId, id: tagId }) => {
      if (!orgId || !tagId) return;
      await invalidate({ orgId, tagId });
      await invalidate({ orgId });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(supabase, { tagId }),
    onSuccess: async ({ org_id: orgId, id: tagId }) => {
      if (!orgId || !tagId) return;
      await invalidate({ orgId, tagId });
      await invalidate({ orgId });
    },
  });

  return {
    insertMutation,
    updateMutation,
    deleteMutation,
  };
};