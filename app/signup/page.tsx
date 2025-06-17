'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes/paths';

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    // Could show a verification message or redirect to verification page
    // For now, redirect to login with success message
    router.push(ROUTES.AUTH.VERIFY_EMAIL);
  };

  const handleSwitchToLogin = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignupForm
          onSuccess={handleSignupSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </div>
    </div>
  );
}