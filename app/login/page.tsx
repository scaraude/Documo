'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, SignupForm } from '@/features/auth';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  const handleSignupSuccess = () => {
    // Could show a verification message or redirect to verification page
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isSignup ? (
          <SignupForm
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setIsSignup(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setIsSignup(true)}
          />
        )}
      </div>
    </div>
  );
}