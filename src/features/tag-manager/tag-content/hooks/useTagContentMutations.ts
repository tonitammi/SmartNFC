import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TagContentQueryKeys } from '../queries/queryKeys';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { 
  assignContentToTag, 
  unassignContentFromTag, 
  createAndAssignContent, 
  type CreateAndAssignParams, 
  type AssignContentParams, 
} from '../queries/mutationQueries';
import { useCallback } from 'react';

export const useTagContentMutations = (orgId: string) => {
  const queryClient = useQueryClient();

  const invalidate = useCallback(async (
    { tagId, contentId }: { tagId: string; contentId?: string }
  ) => {
    const queryKey = [TagContentQueryKeys.tagContentAssignments, orgId, tagId];
    if (contentId) queryKey.push(contentId);
 
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, orgId]);

  const createAndAssignMutation = useMutation({
    mutationFn: ({ tagId, content } : CreateAndAssignParams) => 
      createAndAssignContent(supabase, { tagId, content }),
    onSuccess: ({ tag_id: tagId, content: { id: contentId } }) => {
      invalidate({ tagId });
      invalidate({ tagId, contentId });
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ tagId, contentId } : AssignContentParams) => 
      assignContentToTag(supabase, { tagId, contentId }),
    onSuccess: ({ tag_id: tagId, content: { id: contentId } }) => {
      invalidate({ tagId });
      invalidate({ tagId, contentId });
    },
  });

  const unassignMutation = useMutation({
    mutationFn: ({ tagId, contentId } : AssignContentParams) => 
      unassignContentFromTag(supabase, { tagId, contentId }),
    onSuccess: ({ tag_id: tagId, content_id: contentId }) => {
      invalidate({ tagId });
      invalidate({ tagId, contentId });
    },
  });

  return {
    assignMutation,
    unassignMutation,
    createAndAssignMutation,
  };
};