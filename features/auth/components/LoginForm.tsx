'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../types/zod';
import { EmailVerificationRequired } from './EmailVerificationRequired';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [error, setError] = useState<string>('');
  const [showVerificationRequired, setShowVerificationRequired] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>('');
  const [pendingPassword, setPendingPassword] = useState<string>('');
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError('');
      await login(data.email, data.password);
      onSuccess?.();
    } catch (err) {
      const errorMessage = (err as Error)?.message || 'Login failed. Please try again.';
      console.log('errorMessage', errorMessage);

      // Check if error is about email verification
      if (errorMessage.includes('UNVERIFIED_EMAIL')) {
        setUnverifiedEmail(data.email);
        setPendingPassword(data.password);
        setShowVerificationRequired(true);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleVerificationComplete = async () => {
    setShowVerificationRequired(false);
    onSuccess?.();
  };

  // Show verification required screen if needed
  if (showVerificationRequired) {
    return (
      <EmailVerificationRequired
        email={unverifiedEmail}
        password={pendingPassword}
        onVerificationComplete={handleVerificationComplete}
      />
    );
  }

  return (
    <Card className="w-full max-w-md p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Sign In</h2>
          <p className="text-gray-600 mt-2">Welcome back! Please sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {onSwitchToSignup && (
          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};