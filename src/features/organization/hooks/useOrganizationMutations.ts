import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrganization, deleteOrganization, updateOrganization } from '../queries/mutationQueries';
import { supabase } from '@/src/lib/supabase/supabaseClient';
import type { InsertOrganization, UpdateOrganization } from '../types';
import { useCallback } from 'react';
import { OrgQueryKeys } from '../queries/queryKeys';

export const useOrganizationMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = useCallback(async (
    { userId, orgId }: { userId: string; orgId?: string }
  ) => {
    const queryKey = [OrgQueryKeys.organizations, userId];
    if (orgId) queryKey.push(orgId);
 
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  const insertMutation = useMutation({
    mutationFn: (params: { organization: InsertOrganization }) => (
      createOrganization(supabase, params)
    ),
    onSuccess: async ({ user_id: userId }) => {
      console.log('invalidate!', userId);
      await invalidate({ userId });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { 
      orgId: string;
      userId: string; 
      organization: UpdateOrganization; 
    }) => {
      return updateOrganization(supabase, params);
    },
    onSuccess: async ({ id: orgId, user_id: userId }) => {
      await invalidate({ userId, orgId });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (params: { orgId: string, userId: string }) => {
      return deleteOrganization(supabase, params);
    },
    onSuccess: async ({ id: orgId, user_id: userId }) => {
      await invalidate({ userId, orgId });
    },
  });

  return {
    insertMutation,
    updateMutation,
    deleteMutation,
  };
};