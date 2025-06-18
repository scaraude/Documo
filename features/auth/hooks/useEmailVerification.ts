import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';

interface UseEmailVerificationProps {
  email: string;
  password?: string;
  onVerificationComplete?: () => void;
}

export const useEmailVerification = ({
  email,
  password,
  onVerificationComplete,
}: UseEmailVerificationProps) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const resendMutation = trpc.auth.resendVerification.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const checkVerificationQuery = trpc.auth.checkEmailVerification.useQuery(
    { email },
    {
      refetchInterval: 3000, // Check every 3 seconds
      refetchIntervalInBackground: true,
    }
  );

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  // Handle verification completion
  useEffect(() => {
    if (checkVerificationQuery.data?.isVerified) {
      // If password is provided, auto-login the user
      if (password) {
        loginMutation.mutate(
          { email, password },
          {
            onSuccess: () => {
              onVerificationComplete?.();
            },
            onError: () => {
              // If auto-login fails, still proceed with verification complete
              onVerificationComplete?.();
            },
          }
        );
      } else {
        onVerificationComplete?.();
      }
    }
  }, [
    checkVerificationQuery.data?.isVerified,
    email,
    password,
    loginMutation,
    onVerificationComplete,
  ]);

  const handleResendEmail = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      await resendMutation.mutateAsync({ email });
      setResendSuccess(true);
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    canResend,
    isResending,
    resendSuccess,
    handleResendEmail,
    formatTime,
  };
};
