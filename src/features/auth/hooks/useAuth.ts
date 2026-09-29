import { supabase } from '@lib/supabase/supabaseClient';
import { AuthSessionMissingError, type AuthError, type User, type UserAttributes } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

type AuthStatus = 'initializing' | 'authenticating' | 'authenticated' | 'unauthenticated' | 'logging-out';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('initializing');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const getUser = useCallback(async () => {
    setError(null);

    try {
      const { data, error } = await supabase.auth.getUser(); 
      if (error) throw error;
      setUser(data.user);
      setStatus('authenticated');
      return data.user;

    } catch(err) {
      if (!(err instanceof AuthSessionMissingError)) {
        setError((err as AuthError).message);
      }
      setStatus('unauthenticated');
      return null;
    } 
  }, []);


  const createAuthListener = useCallback((callback?: (user: User | null, error: AuthError | null) => void) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        setStatus('authenticated');
      }
      
      if (callback) {
        return callback(data.user, error);
      }

    });
    
    return subscription;
  }, []);

  const logout = useCallback(async () => {
    setStatus('logging-out');
    const authRes = await supabase.auth.signOut();
    setUser(null);
    setStatus('unauthenticated');

    return authRes;
  }, []);

  const signIn = useCallback(async (email: string, password: string, redirectUrl?: string | null) => {
    setStatus('authenticating');
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      setStatus('authenticated');

      if (redirectUrl) navigate(redirectUrl, { replace: true });
      else navigate('/dashboard');

      return data;
    } catch(err) {
      setError((err as AuthError).message);
      setStatus('unauthenticated');
    } 
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string) => {
    setStatus('authenticating');
    setError(null);
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setUser(data.user);
      setStatus('authenticated');
      navigate('/dashboard');
      return data;
    } catch(err) {
      setError((err as AuthError).message);
      setStatus('unauthenticated');
    } 
  }, [navigate]);

  const resetPassword = useCallback(async (email: string, redirectUrl: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;
      return { error };
    } catch(err) {
      return { error: err as AuthError };
    } 
  }, []);

  const updateUser = useCallback(async (userAttributes: UserAttributes) => {
    return await supabase.auth.updateUser(userAttributes);
  }, []);

  useEffect(() => {
    setStatus('initializing');
    getUser();
  }, [getUser]);

  return { 
    status, 
    error, 
    user, 
    createAuthListener,
    getUser, 
    signIn,
    signUp,
    logout,
    resetPassword, 
    updateUser,
  };
};