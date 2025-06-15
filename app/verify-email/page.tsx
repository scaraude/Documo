'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { EmailVerificationRequired } from '@/features/auth/components/EmailVerificationRequired';
import { useVerificationSession } from '@/features/auth/hooks/useVerificationSession';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/constants/routes/paths';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  const { email: sessionEmail, hasSession, clearSession } = useVerificationSession();

  const token = searchParams.get('token');

  const handleVerificationComplete = () => {
    clearSession(); // Clear session storage after successful verification
    // After email verification, redirect to login page for user to enter password again
    router.push(ROUTES.AUTH.LOGIN);
  };

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

  // If email is available in session, show EmailVerificationRequired component
  if (hasSession && sessionEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <EmailVerificationRequired
          email={sessionEmail}
          onVerificationComplete={handleVerificationComplete}
        />
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