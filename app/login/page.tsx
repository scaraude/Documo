'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes/paths';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push(ROUTES.HOME);
  };

  const handleSwitchToSignup = () => {
    router.push(ROUTES.AUTH.SIGNUP);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </div>
    </div>
  );
}