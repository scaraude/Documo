'use client';

import React, { createContext, useCallback, useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import type { AuthContextValue, User, UserSession } from '../types';
import logger from '@/lib/logger';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  // tRPC mutations
  const signupMutation = trpc.auth.signup.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();
  const resendVerificationMutation = trpc.auth.resendVerification.useMutation();

  // tRPC query for current user
  const { data: currentUser, isLoading: isLoadingUser, error } = trpc.auth.me.useQuery(
    undefined,
    {
      enabled: true,
      retry: false,
    }
  );

  useEffect(() => {
    if (!isLoadingUser) {
      if (currentUser) {
        setUser(currentUser);
      } else if (error) {
        setUser(null);
        setSession(null);
      }
    }
  }, [isLoadingUser, currentUser, error]);

  const signup = useCallback(
    async (email: string, password: string, firstName?: string, lastName?: string) => {
      try {
        const result = await signupMutation.mutateAsync({
          email,
          password,
          firstName: firstName || '',
          lastName: lastName || '',
        });

        logger.info({ email, operation: 'auth.signup.success' }, 'User signed up successfully');
        return result;
      } catch (error) {
        logger.error({ email, error: (error as Error).message }, 'Signup failed');
        throw error;
      }
    },
    [signupMutation]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation.mutateAsync({ email, password });
        console.log('Provider: Login result:', result);
        if (result.success && result.user) {
          setUser(result.user);
        }

        logger.info({ email, operation: 'auth.login.success' }, 'User logged in successfully');
      } catch (error) {
        logger.error({ email, error: (error as Error).message }, 'Login failed');
        throw error;
      }
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();

      setUser(null);
      setSession(null);

      logger.info({ operation: 'auth.logout.success' }, 'User logged out successfully');
    } catch (error) {
      logger.error({ error: (error as Error).message }, 'Logout failed');
      // Even if logout fails, clear local state
      setUser(null);
      setSession(null);
    }
  }, [logoutMutation]);

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const result = await verifyEmailMutation.mutateAsync({ token });
        logger.info({ operation: 'auth.verifyEmail.success' }, 'Email verified successfully');
        return result;
      } catch (error) {
        logger.error({ error: (error as Error).message }, 'Email verification failed');
        throw error;
      }
    },
    [verifyEmailMutation]
  );

  const resendVerification = useCallback(
    async (email: string) => {
      try {
        const result = await resendVerificationMutation.mutateAsync({ email });
        logger.info({ email, operation: 'auth.resendVerification.success' }, 'Verification email resent');
        return result;
      } catch (error) {
        logger.error({ email, error: (error as Error).message }, 'Resend verification failed');
        throw error;
      }
    },
    [resendVerificationMutation]
  );

  const value: AuthContextValue = React.useMemo(() => ({
    user,
    session,
    isLoading: isLoadingUser || signupMutation.isPending || loginMutation.isPending || logoutMutation.isPending,
    login,
    signup,
    logout,
    verifyEmail,
    resendVerification,
  }), [user, session, isLoadingUser, signupMutation.isPending, loginMutation.isPending, logoutMutation.isPending, login, signup, logout, verifyEmail, resendVerification]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};