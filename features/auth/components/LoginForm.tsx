'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../types/zod';
import { ROUTES } from '@/shared/constants/routes/paths';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignup,
  onSwitchToForgotPassword,
}) => {
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const { login, isLoading } = useAuth();
  const router = useRouter();

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
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || 'Connexion échouée. Veuillez réessayer.';
      console.log('errorMessage', errorMessage);

      // Check if error is about email verification
      if (errorMessage.includes('UNVERIFIED_EMAIL')) {
        // Store only email in sessionStorage (no password for security)
        sessionStorage.setItem('unverified_email', data.email);
        router.push(ROUTES.AUTH.VERIFY_EMAIL);
      } else {
        // Increment failed attempts for authentication errors
        if (
          errorMessage.includes('Invalid credentials') ||
          errorMessage.includes('mot de passe')
        ) {
          setFailedAttempts(prev => prev + 1);
        }
        setError(errorMessage);
      }
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Connexion</h2>
          <p className="text-gray-600 mt-2">
            Bon retour ! Connectez-vous à votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez votre email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              {onSwitchToForgotPassword && (
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
              {failedAttempts >= 2 && onSwitchToForgotPassword && (
                <div className="mt-2 pt-2 border-t border-red-300">
                  <p className="text-sm">
                    Vous avez des difficultés à vous connecter ?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToForgotPassword}
                      className="font-medium underline hover:no-underline"
                    >
                      Réinitialisez votre mot de passe
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        {onSwitchToSignup && (
          <div className="text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                S&apos;inscrire
              </button>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
