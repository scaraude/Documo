'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import {
  validatePassword,
  passwordRequirements,
} from '@/features/auth/types/zod';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, showRequirements = true }) => {
  const validation = validatePassword(password);

  // Calculate strength score (0-5 based on requirements met)
  const score = passwordRequirements.length - validation.errors.length;

  // Get strength level and color
  const getStrengthInfo = (score: number) => {
    if (score === 0)
      return { label: '', color: 'bg-gray-200', textColor: 'text-gray-400' };
    if (score <= 1)
      return {
        label: 'Très faible',
        color: 'bg-red-500',
        textColor: 'text-red-600',
      };
    if (score <= 2)
      return {
        label: 'Faible',
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
      };
    if (score <= 3)
      return {
        label: 'Moyen',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
      };
    if (score <= 4)
      return {
        label: 'Fort',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
      };
    return {
      label: 'Très fort',
      color: 'bg-green-500',
      textColor: 'text-green-600',
    };
  };

  const strength = getStrengthInfo(score);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700">
            Force du mot de passe
          </span>
          <span className={`text-xs font-medium ${strength.textColor}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(score / passwordRequirements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-700">Exigences :</span>
          <ul className="space-y-1">
            {passwordRequirements.map((requirement, index) => {
              // Precise validation for each requirement
              let requirementMet = false;
              if (requirement.includes('8 caractères')) {
                requirementMet = password.length >= 8;
              } else if (requirement.includes('minuscule')) {
                requirementMet = /[a-z]/.test(password);
              } else if (requirement.includes('majuscule')) {
                requirementMet = /[A-Z]/.test(password);
              } else if (requirement.includes('chiffre')) {
                requirementMet = /[0-9]/.test(password);
              } else if (requirement.includes('spécial')) {
                requirementMet = /[^A-Za-z0-9]/.test(password);
              }

              return (
                <li key={index} className="flex items-center space-x-2">
                  {requirementMet ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-500" />
                  )}
                  <span
                    className={`text-xs ${requirementMet ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    {requirement}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
