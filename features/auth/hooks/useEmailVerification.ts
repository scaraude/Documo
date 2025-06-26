import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [isProcessingVerification, setIsProcessingVerification] =
    useState(false);
  const isLoginInProgress = useRef(false);
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const resendMutation = trpc.auth.resendVerification.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const checkVerificationQuery = trpc.auth.checkEmailVerification.useQuery(
    { email },
    {
      refetchInterval: 10000, // Check every 10 seconds instead of 3
      refetchIntervalInBackground: true,
      enabled: !isProcessingVerification, // Disable polling when processing
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

  // Debounced verification handler to prevent race conditions
  const handleVerificationComplete = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (!isProcessingVerification) {
        setIsProcessingVerification(true);
        // If password is provided, auto-login the user
        if (password && !isLoginInProgress.current) {
          isLoginInProgress.current = true;
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
              onSettled: () => {
                isLoginInProgress.current = false;
                setIsProcessingVerification(false);
              },
            }
          );
        } else if (!password) {
          onVerificationComplete?.();
          setIsProcessingVerification(false);
        }
      }
    }, 500); // 500ms debounce
  }, [
    email,
    password,
    loginMutation,
    onVerificationComplete,
    isProcessingVerification,
  ]);

  // Handle verification completion with debouncing
  useEffect(() => {
    if (checkVerificationQuery.data?.isVerified && !isProcessingVerification) {
      handleVerificationComplete();
    }
  }, [
    checkVerificationQuery.data?.isVerified,
    handleVerificationComplete,
    isProcessingVerification,
  ]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

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
    isProcessingVerification,
  };
};
