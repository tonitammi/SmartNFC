import type { Organization, UserOrganization } from './types';

interface OrganizationUserWithOrganization {
    role: string;
    organization: {
        created_at: string | null;
        display_name: string | null;
        id: string;
        name: string;
        owner_id: string | null;
        updated_at: string | null;
    } | null;
};

export const toUserOrganization = (
  itemToTransform: OrganizationUserWithOrganization, 
  userId: string
): UserOrganization | null => {
  const { organization, role } = itemToTransform;

  return !organization ? null : {
    ...(organization as Organization),
    user_role: userId === organization.owner_id ? 'owner' : role as UserOrganization['user_role'],
    user_id: userId,
    is_owner: userId === organization.owner_id,
  };
};