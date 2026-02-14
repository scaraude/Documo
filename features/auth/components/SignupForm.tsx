'use client';

import { PasswordStrengthIndicator } from '@/shared/components/ui/PasswordStrengthIndicator';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { type SignupInput, signupSchema } from '../types/zod';

interface SignupFormProps {
  onSuccess?: (email?: string) => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { signup, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const watchedPassword = watch('password', '');

  const onSubmit = async (data: SignupInput) => {
    try {
      setError('');

      const result = await signup(
        data.email,
        data.password,
        data.organizationName,
      );
      sessionStorage.setItem('unverified_email', data.email);
      toast.success(result.message);
      onSuccess?.(data.email);
    } catch (err) {
      setError(
        (err as Error)?.message || 'Inscription échouée. Veuillez réessayer.',
      );
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Rejoignez-nous !</h2>
          <p className="text-gray-600 mt-2">
            Créez votre compte pour commencer.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="organizationName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom de l&apos;organisation
            </label>
            <input
              {...register('organizationName')}
              type="text"
              id="organizationName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Acme SAS"
            />
            {errors.organizationName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizationName.message}
              </p>
            )}
          </div>

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
              placeholder="jean@exemple.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Créez un mot de passe sécurisé (8+ caractères)"
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
            {watchedPassword && (
              <div className="mt-3">
                <PasswordStrengthIndicator password={watchedPassword} />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="mt-3 w-full">
            {isLoading ? 'Création du compte...' : 'Créer un compte'}
          </Button>
        </form>

        {onSwitchToLogin && (
          <div className="text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Se connecter
              </button>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
