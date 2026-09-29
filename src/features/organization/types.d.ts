import type { SupabaseDatabase } from '@/src/lib/supabase/database.types';
import type { UserOrganizationRole } from '../../user/types';

export type Organization = SupabaseDatabase['public']['Tables']['organizations']['Row'];
export type OrgUser = SupabaseDatabase['public']['Tables']['organization_users']['Row'];

export type InsertOrganization = Pick<SupabaseDatabase['public']['Tables']['organizations']['Insert'], 'name' | 'display_name'>;
export type UpdateOrganization = Omit<SupabaseDatabase['public']['Tables']['organizations']['Update'], 'id'>;

export interface UserOrganization extends Organization {
  user_role: UserOrganizationRole;
  user_id: string;
  is_owner: boolean;
}
