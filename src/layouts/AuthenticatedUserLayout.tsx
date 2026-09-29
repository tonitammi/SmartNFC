import { Outlet } from 'react-router';

export const AuthenticatedUserLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};