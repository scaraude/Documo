'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { useVerificationSession } from '@/features/auth/hooks/useVerificationSession';
import { useEmailVerification } from '@/features/auth/hooks/useEmailVerification';
import { useEmailMasking } from '@/features/auth/hooks/useEmailMasking';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes/paths';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  const { email: sessionEmail, hasSession, clearSession } = useVerificationSession();
  const { maskEmail } = useEmailMasking();

  const token = searchParams.get('token');

  // Use email verification hook when we have session email but no token
  const emailVerificationHook = useEmailVerification({
    email: sessionEmail || '',
    onVerificationComplete: () => {
      clearSession();
      router.push(ROUTES.AUTH.LOGIN);
    },
  });


  useEffect(() => {
    if (!token) {
      // If no token but we have a session, that's handled in the component return
      if (!hasSession) {
        setStatus('error');
        setMessage('No verification token provided. Please try logging in again.');
      }
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully. You can now log in.');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(ROUTES.AUTH.LOGIN);
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage((error as Error)?.message || 'Email verification failed');
      }
    };

    verify();
  }, [token, verifyEmail, router, hasSession]);

  // If email is available in session but no token, show custom resend UI
  if (hasSession && sessionEmail && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
                We need to verify your email address:
              </p>
              <p className="font-medium text-gray-900 mt-1">
                {maskEmail(sessionEmail)}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                Click the button below to send a verification email, then check your inbox for the verification link.
                Don&apos;t forget to check your spam folder!
              </p>
            </div>

            {emailVerificationHook.resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm">
                  Verification email sent successfully! Check your inbox.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={emailVerificationHook.handleResendEmail}
                disabled={!emailVerificationHook.canResend || emailVerificationHook.isResending}
                variant={emailVerificationHook.canResend ? "default" : "secondary"}
                className="w-full"
              >
                {emailVerificationHook.isResending ? (
                  'Sending...'
                ) : emailVerificationHook.canResend ? (
                  'Send Verification Email'
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Resend in {emailVerificationHook.formatTime(emailVerificationHook.timeLeft)}</span>
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                Didn&apos;t receive the email? Check your spam folder or or try to resend.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="w-full"
            >
              Back to Login
            </Button>

            <div className="text-xs text-gray-400 border-t pt-4">
              Need help? Contact support if you continue having issues.
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // If no session and no token, show error message
  if (!hasSession && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Email Verification</h2>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <p className="text-red-700 mb-4">No verification session found. Please try logging in again.</p>
            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      await resendVerification(email);
      setMessage('Verification email sent. Please check your inbox.');
    } catch (error) {
      setMessage((error as Error)?.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Email Verification</h2>

          {status === 'loading' && (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <p className="text-green-700 mb-4">{message}</p>
              <p className="text-gray-600">Redirecting to login page...</p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="text-red-600 text-6xl mb-4">✗</div>
              <p className="text-red-700 mb-4">{message}</p>

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email to resend verification"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <Button
                  onClick={handleResendVerification}
                  disabled={!email}
                  className="w-full"
                >
                  Resend Verification Email
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Email Verification</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}