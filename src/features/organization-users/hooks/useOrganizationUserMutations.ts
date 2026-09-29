import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrgUserQueryKeys } from '../queries/queryKeys';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import { createOrganizationUser, deleteOrganizationUser, updateOrganizationUser } from '../queries/mutationQueries';
import { useCallback } from 'react';
import type { InsertOrganizationUser, UpdateOrganizationUser } from '../types';

export const useOrganizationUserMutations = (orgId: string) => {
  const queryClient = useQueryClient();

  const invalidate = useCallback(async (
    params?: { userId?: string;  }
  ) => {
      const queryKey = [OrgUserQueryKeys.organizationUsers, orgId];
      if (params?.userId) queryKey.push(params?.userId);
    
      return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, orgId]);

  const insertMutation = useMutation({
    mutationFn: ({ user } : { user: InsertOrganizationUser }) => (
      createOrganizationUser(supabase, { user })
    ),
    onSuccess: async () => {
      if (!orgId) return;
      await invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, user }: { userId: string, user: UpdateOrganizationUser }) => (
      updateOrganizationUser(supabase, { userId, user })
    ),
    onSuccess: async ({ user_id: userId }) => {
      if (!orgId || !userId) return;
      await invalidate({ userId });
      await invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId } : { userId: string }) => (
      deleteOrganizationUser(supabase, { userId })
    ),
    onSuccess: async ({ user_id: userId }) => {
      if (!orgId || !userId) return;
      await invalidate({ userId });
      await invalidate();
    },
  });

  return {
    insertMutation,
    updateMutation,
    deleteMutation,
  };
};