'use client';

import { useEffect, useState } from 'react';

interface VerificationSession {
  email: string | null;
}

export const useVerificationSession = () => {
  const [session, setSession] = useState<VerificationSession>({
    email: null,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('unverified_email');
      
      setSession({
        email,
      });
    }
  }, []);

  const clearSession = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('unverified_email');
      setSession({ email: null });
    }
  };

  const hasSession = session.email !== null;

  return {
    email: session.email,
    hasSession,
    clearSession,
  };
};