import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

export type OrganizationInvitation = SupabaseDatabase['public']['Tables']['organization_invitations']['Row'];
export type InsertOrganizationInvitation = SupabaseDatabase['public']['Tables']['organization_invitations']['Insert'];
export type UpdateOrganizationInvitation = SupabaseDatabase['public']['Tables']['organization_invitations']['Update'];

export type InvitationStatus = 'pending' | 'accepted' | 'declined';