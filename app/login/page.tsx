'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes/paths';

type AuthView = 'login' | 'forgot-password' | 'reset-password';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [resetToken, setResetToken] = useState<string>('');

  // Check for reset token in URL params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setResetToken(token);
      setCurrentView('reset-password');
    }
  }, [searchParams]);

  const handleLoginSuccess = () => {
    router.push(ROUTES.HOME);
  };

  const handleSwitchToSignup = () => {
    router.push(ROUTES.AUTH.SIGNUP);
  };

  const handleSwitchToForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    // Clear token from URL if present
    if (resetToken) {
      router.replace('/login');
      setResetToken('');
    }
  };

  const handleForgotPasswordSuccess = () => {
    // Stay on the forgot password form to show success message
    // User will use the email link to reset password
  };

  const handleResetPasswordSuccess = () => {
    // Redirect to login after successful password reset
    setCurrentView('login');
    if (resetToken) {
      router.replace('/login');
      setResetToken('');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBackToLogin={handleBackToLogin}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordForm
            token={resetToken}
            onSuccess={handleResetPasswordSuccess}
            onBackToLogin={handleBackToLogin}
          />
        );
      default:
        return (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">{renderCurrentView()}</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
