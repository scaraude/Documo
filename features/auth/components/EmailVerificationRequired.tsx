'use client';

import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { useEmailVerification } from '../hooks/useEmailVerification';
import { useEmailMasking } from '../hooks/useEmailMasking';

interface EmailVerificationRequiredProps {
  email: string;
  password?: string; // Optional password to auto-login after verification
  onVerificationComplete?: () => void;
}

export const EmailVerificationRequired: React.FC<EmailVerificationRequiredProps> = ({
  email,
  password,
  onVerificationComplete,
}) => {
  const {
    timeLeft,
    canResend,
    isResending,
    resendSuccess,
    handleResendEmail,
    formatTime,
  } = useEmailVerification({
    email,
    password,
    onVerificationComplete,
  });

  const { maskEmail } = useEmailMasking();

  return (
    <Card className="w-full max-w-md p-6">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We&apos;ve sent a verification link to:
          </p>
          <p className="font-medium text-gray-900 mt-1">
            {maskEmail(email)}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            Please check your email and click the verification link to continue.
            Don&apos;t forget to check your spam folder!
          </p>
        </div>

        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 text-sm">
              Verification email sent successfully!
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={!canResend || isResending}
            variant={canResend ? "default" : "secondary"}
            className="w-full"
          >
            {isResending ? (
              'Sending...'
            ) : canResend ? (
              'Resend Email'
            ) : (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Resend in {formatTime(timeLeft)}</span>
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or try resending.
          </p>
        </div>

        <div className="text-xs text-gray-400 border-t pt-4">
          Need help? Contact support if you continue having issues.
        </div>
      </div>
    </Card>
  );
};