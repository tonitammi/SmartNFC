import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';

export type OrganizationUser = SupabaseDatabase['public']['Tables']['organization_users']['Row'];

export interface OrganizationsUserWithOwner extends OrganizationUser {
  organization: {
    owner_id: string | null;
  } | null;
};

export type OrganizationUserRole = 'visitor' | 'user' | 'editor' | 'admin' | 'owner';

export interface InsertOrganizationUser extends Omit<
    SupabaseDatabase['public']['Tables']['organization_users']['Insert'], 
    'id' | 'created_at' | 'updated_at'
> {
  user_id: string;
};

export type UpdateOrganizationUser = Partial<Omit<InsertOrganizationUser, 'user_id' | 'org_id'>>;