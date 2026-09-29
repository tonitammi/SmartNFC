import { useEffect } from 'react';
import { useParams, Outlet, Navigate } from 'react-router';
import { useOrganizationContext } from '@features/organization/context/useOrganizationContext';
import { CircularProgress } from '@mui/material';

export type OrganizationSyncLayoutProps = {
  redirectTo?: string;
}

export const OrganizationSyncLayout = ({ 
  redirectTo = '/dashboard', 
} : OrganizationSyncLayoutProps) => {
  const { orgId } = useParams<{ orgId: string }>();
  const { 
    organizations, 
    currentOrganization, 
    setCurrentOrganization, 
    isLoading, 
  } = useOrganizationContext();

  useEffect(() => {
    if (!isLoading && orgId) {
      if (currentOrganization?.id !== orgId) {
        try {
          setCurrentOrganization(orgId);
        } catch (err) {
          console.error('Pääsy evätty tai organisaatiota ei löydy', err);
        }
      }
    }
  }, [orgId, isLoading, organizations, currentOrganization, setCurrentOrganization]);

  if (isLoading) return <CircularProgress />;

  const hasAccess = organizations.some(o => o.id === orgId);

  if (orgId && !hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};