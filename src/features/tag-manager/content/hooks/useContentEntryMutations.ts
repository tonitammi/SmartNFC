import type { ContentEntry, InsertContentEntry, UpdateContentEntry } from '../types';
import { ContentQueryKeys } from '../queries/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContentEntry, deleteContentEntry, updateContentEntry } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { useCallback } from 'react';

export const useContentEntryMutations = (orgId: string) => {
  const queryClient = useQueryClient();

  const invalidate = useCallback(async (contentId?: string) => {
    const queryKey = [ContentQueryKeys.contentEntries, orgId];
    if (contentId) queryKey.push(contentId);
 
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, orgId]);

  const insertMutation = useMutation({
    mutationFn: (contentEntry: InsertContentEntry) => createContentEntry(supabase, {
      contentEntry: {
        ...contentEntry, 
        org_id: orgId,
      },
    }),
    onSuccess: () => {
      invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, contentEntry } : {
      id: string;
      contentEntry: UpdateContentEntry | ContentEntry;
    }) => updateContentEntry(supabase, {
      contentId: id,
      contentEntry: {
        ...contentEntry, 
        org_id: orgId,
      },
    }),
    onSuccess: ({ id }) => {
      invalidate();
      invalidate(id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id } : { id: string }) => deleteContentEntry(supabase, {
      contentId: id,
    }),
    onSuccess: ({ id }) => {
      invalidate();
      invalidate(id);
    },
  });

  return {
    insertMutation,
    updateMutation,
    deleteMutation,
  };
};

