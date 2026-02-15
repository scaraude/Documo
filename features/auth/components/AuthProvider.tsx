'use client';

import logger from '@/lib/logger';
import { trpc } from '@/lib/trpc/client';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import type {
  AuthContextValue,
  Organization,
  OrganizationSession,
} from '../types';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [session, setSession] = useState<OrganizationSession | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const signupMutation = trpc.auth.signup.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();
  const resendVerificationMutation = trpc.auth.resendVerification.useMutation();
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();

  const { data: currentOrganization, isLoading: isLoadingOrganization } =
    trpc.auth.me.useQuery(undefined, {
      enabled: true,
      retry: false,
      throwOnError: (error) => {
        return error.data?.code !== 'UNAUTHORIZED';
      },
    });

  useEffect(() => {
    if (!isLoadingOrganization) {
      if (currentOrganization) {
        setOrganization(currentOrganization);
      } else {
        setOrganization(null);
        setSession(null);
      }
      setAuthInitialized(true);
    }
  }, [isLoadingOrganization, currentOrganization]);

  const signup = useCallback(
    async (email: string, password: string, organizationName: string) => {
      try {
        const result = await signupMutation.mutateAsync({
          email,
          password,
          organizationName,
        });

        logger.info(
          { email, operation: 'auth.signup.success' },
          'Organization signed up successfully',
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
        if (result.success && result.organization) {
          setOrganization(result.organization);
        }

        logger.info(
          { email, operation: 'auth.login.success' },
          'Organization logged in successfully',
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

      setOrganization(null);
      setSession(null);

      logger.info(
        { operation: 'auth.logout.success' },
        'Organization logged out successfully',
      );
    } catch (error) {
      logger.error({ error: (error as Error).message }, 'Logout failed');
      setOrganization(null);
      setSession(null);
    }
  }, [logoutMutation]);

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        const result = await verifyEmailMutation.mutateAsync({ token });
        if (result.success && result.organization) {
          setOrganization(result.organization);
        }
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
      organization,
      session,
      isLoading: !authInitialized,
      login,
      signup,
      logout,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
    }),
    [
      organization,
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
