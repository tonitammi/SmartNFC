import { createContext } from 'react';
import type { UserOrganization } from '../types';

export type OrganizationContextValue = {
  currentOrganization: UserOrganization | null;
  organizations: UserOrganization[];
  setCurrentOrganization: (org: UserOrganization['id']) => void;
  isLoading: boolean;
};

export const OrganizationContext = createContext<OrganizationContextValue | null>(null);