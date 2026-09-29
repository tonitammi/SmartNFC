import type { UserOrganization } from '../types';

import { useContext, type ReactNode } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { OrganizationContext } from './OrganizationContext';
import { useOrganizationsQuery } from '../hooks/useOrganizationsQuery';
import { useEncryptedStorage } from '@/src/hooks/useEncryptedStorage';

interface OrganizationContextProviderProps {
  children: ReactNode | ReactNode[] | null;
}

export const OrganizationContextProvider = ({ children = null} : OrganizationContextProviderProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('OrganizationContextProvider must be used within an AuthContextProvider and authContext can\' be null');
  }

  const { id: userId } = authContext.user || { id: null };
  const { data: organizations, isLoading } = useOrganizationsQuery({ userId });

  const [ 
    currentOrganization, 
    setCurrentOrganization, 
  ] = useEncryptedStorage<UserOrganization | null>(
    userId, 
    'default_organization', 
    null
  );

  return (
    <OrganizationContext 
      value={{
        currentOrganization,
        organizations: organizations || [],
        isLoading,
        setCurrentOrganization: (orgId) => {
          if (!organizations) return;
          const org = organizations.find(x => x.id === orgId);
          if (!org) {
            throw Error('You don\'t have access rights to this organization ');
          }
          setCurrentOrganization(org);
        },
      }}
    >
      { children }
    </OrganizationContext>
  );
};