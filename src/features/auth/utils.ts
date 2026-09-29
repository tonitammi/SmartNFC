import type { OrganizationUserRole } from '../organization-users/types';
import type { RequireAuthWrapperProps } from './components/RequireAuthWrapper';

type AcceptedRolesParam = NonNullable<RequireAuthWrapperProps['requireRole']>['acceptedRoles'];

const ACCEPTED_ROLES: Record<OrganizationUserRole | 'authenticated', OrganizationUserRole[]> = {
  visitor: ['visitor', 'user', 'editor', 'admin', 'owner'],
  authenticated: ['user', 'editor', 'admin', 'owner'],
  user: ['user', 'editor', 'admin', 'owner'],
  editor: ['editor', 'admin', 'owner'],
  admin: ['admin', 'owner'],
  owner: ['owner'],
} as const;

const handleExplicitRoles = (  
  currentRole: OrganizationUserRole, 
  acceptedRoles: AcceptedRolesParam
): boolean => {
  const roleArr = Array.isArray(acceptedRoles) ? acceptedRoles : [acceptedRoles];
  const allAcceptedRoles = new Set([
    ...roleArr.map((roleKey) => ACCEPTED_ROLES[roleKey]).flat(),
  ]);

  return allAcceptedRoles.has(currentRole);
};

const handleImplicitRoles = (  
  currentRole: OrganizationUserRole, 
  acceptedRoles: AcceptedRolesParam
): boolean => {
  if (Array.isArray(acceptedRoles)) {
    return acceptedRoles.includes(currentRole);
  };

  if (acceptedRoles === 'authenticated') {
    return true;
  };

  return currentRole === acceptedRoles;
};

export const isAuthorized = (
  currentRole: OrganizationUserRole, 
  acceptedRoles: AcceptedRolesParam,
  implicit: boolean = false
): boolean => {
  if (!currentRole) return false;

  if (implicit) {
    console.log('implicit');
    return handleImplicitRoles(currentRole, acceptedRoles);
  };

  return handleExplicitRoles(currentRole, acceptedRoles);
};