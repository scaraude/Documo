import { ROUTES } from '@/shared/constants';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Checks if an error is a tRPC authentication error
 */
function isAuthError(error: unknown): boolean {
  if (error instanceof TRPCClientError) {
    return error.data?.code === 'UNAUTHORIZED';
  }
  return false;
}

/**
 * Handles authentication errors by showing a toast and redirecting to login
 */
function handleAuthError(error: unknown, router: ReturnType<typeof useRouter>) {
  if (isAuthError(error)) {
    toast.error('Votre session a expiré. Veuillez vous reconnecter.');
    router.push(ROUTES.AUTH.LOGIN);
    return true;
  }
  return false;
}

/**
 * Creates an error handler function for tRPC operations
 * Usage: onError: createAuthErrorHandler(router)
 */
function createAuthErrorHandler(router: ReturnType<typeof useRouter>) {
  return (error: unknown) => {
    if (!handleAuthError(error, router)) {
      // Handle other errors as needed
      console.error('tRPC error:', error);
      toast.error('Une erreur est survenue');
    }
  };
}

/**
 * Hook to create an auth error handler
 */
export function useAuthErrorHandler() {
  const router = useRouter();

  return {
    handleAuthError: (error: unknown) => handleAuthError(error, router),
    createErrorHandler: () => createAuthErrorHandler(router),
  };
}
