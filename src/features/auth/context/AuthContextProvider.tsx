import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContext } from './AuthContext';

export const AuthContextProvider = ({ children } : { children: ReactNode | ReactNode[] }) => {
  const auth = useAuth();

  return (
    <AuthContext value={auth}>
      { children }
    </AuthContext>
  );
};