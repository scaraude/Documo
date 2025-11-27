'use client';

import logger from '@/lib/logger';
import { trpc } from '@/lib/trpc/client';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { AuthContextValue, User, UserSession } from '../types';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // tRPC mutations
  const signupMutation = trpc.auth.signup.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();
  const resendVerificationMutation = trpc.auth.resendVerification.useMutation();
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();

  // tRPC query for current user
  const { data: currentUser, isLoading: isLoadingUser } = trpc.auth.me.useQuery(
    undefined,
    {
      enabled: true,
      retry: false,
      // Don't throw on UNAUTHORIZED - treat it as "not authenticated"
      throwOnError: (error) => {
        // Only throw on unexpected errors, not auth errors
        return error.data?.code !== 'UNAUTHORIZED';
      },
    },
  );

  useEffect(() => {
    if (!isLoadingUser) {
      // Auth check is complete, set the final state
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        setSession(null);
      }
      setAuthInitialized(true);
    }
  }, [isLoadingUser, currentUser]);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
    ) => {
      try {
        const result = await signupMutation.mutateAsync({
          email,
          password,
          firstName: firstName || '',
          lastName: lastName || '',
        });

        logger.info(
          { email, operation: 'auth.signup.success' },
          'User signed up successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          { email, error: (error as Error).message },
          'Signup failed',
        );
        throw error;
      }
    },
    [signupMutation],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation.mutateAsync({ email, password });
        console.log('Provider: Login result:', result);
        if (result.success && result.user) {
          setUser(result.user);
        }

        logger.info(
          { email, operation: 'auth.login.success' },
          'User logged in successfully',
        );
      } catch (error) {
        logger.error(
          { email, error: (error as Error).message },
          'Login failed',
        );
        throw error;
      }
    },
    [loginMutation],
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();

      setUser(null);
      setSession(null);

      logger.info(
        { operation: 'auth.logout.success' },
        'User logged out successfully',
      );
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
        logger.info(
          { operation: 'auth.verifyEmail.success' },
          'Email verified successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          { error: (error as Error).message },
          'Email verification failed',
        );
        throw error;
      }
    },
    [verifyEmailMutation],
  );

  const resendVerification = useCallback(
    async (email: string) => {
      try {
        const result = await resendVerificationMutation.mutateAsync({ email });
        logger.info(
          { email, operation: 'auth.resendVerification.success' },
          'Verification email resent',
        );
        return result;
      } catch (error) {
        logger.error(
          { email, error: (error as Error).message },
          'Resend verification failed',
        );
        throw error;
      }
    },
    [resendVerificationMutation],
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        const result = await forgotPasswordMutation.mutateAsync({ email });
        logger.info(
          { email, operation: 'auth.forgotPassword.success' },
          'Password reset email sent',
        );
        return result;
      } catch (error) {
        logger.error(
          { email, error: (error as Error).message },
          'Forgot password failed',
        );
        throw error;
      }
    },
    [forgotPasswordMutation],
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      try {
        const result = await resetPasswordMutation.mutateAsync({
          token,
          password,
        });
        logger.info(
          {
            token: `${token.substring(0, 8)}...`,
            operation: 'auth.resetPassword.success',
          },
          'Password reset successfully',
        );
        return result;
      } catch (error) {
        logger.error(
          {
            token: `${token.substring(0, 8)}...`,
            error: (error as Error).message,
          },
          'Reset password failed',
        );
        throw error;
      }
    },
    [resetPasswordMutation],
  );

  const value: AuthContextValue = React.useMemo(
    () => ({
      user,
      session,
      isLoading: !authInitialized, // Only false when auth check is completely done
      login,
      signup,
      logout,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
    }),
    [
      user,
      session,
      authInitialized,
      login,
      signup,
      logout,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
