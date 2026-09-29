import type { OrganizationUserRole } from '@src/features/organization-users/types';

// import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import { AUTH_REDIRECT_KEY  } from '../constants';
import { CircularProgress, Container, Stack } from '@mui/material';
import { useAuthContext } from '../context/useAuthContext';
import { useOrganizationContext } from '../../organization/context/useOrganizationContext';
import { isAuthorized } from '../utils';

export type RequireAuthWrapperProps = {
  redirectUrl?: string;
  requireRole?: { 
    acceptedRoles: OrganizationUserRole | OrganizationUserRole[] | 'authenticated';
    implicit?: boolean; 
  };
}

export const RequireAuthWrapper = ({ 
  requireRole,
  redirectUrl = 'login', 
} : RequireAuthWrapperProps) => {
  const { user, status } = useAuthContext();
  const { currentOrganization } = useOrganizationContext();
 
  // useEffect(() => {
  //   const subscription = createAuthListener();
  //   return () => subscription?.unsubscribe();
  // }, [createAuthListener]);

  if (status === 'initializing') {
    return (<>
      <Container sx={{ paddingTop: '8rem', paddingBottom: '3rem' }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      </Container>
    </>);
  }

  if (!user) {
    const currentPath = window.location.pathname;
    const redirectToUrl = `/${redirectUrl}?${AUTH_REDIRECT_KEY }=${currentPath}`;
    return <Navigate to={redirectToUrl} />;
  }

  if (requireRole && currentOrganization) {
    if (!isAuthorized(
      currentOrganization.user_role, 
      requireRole.acceptedRoles,
      requireRole.implicit
    )) {
      const errorUrl = `/error/unauthorized?sourcePath=${ window.location.pathname}`;
      return <Navigate to={errorUrl} />;
    };
  }

  return <Outlet />;
};