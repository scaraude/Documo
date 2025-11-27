'use client';

import { useAuth } from '@/features/auth';
import { useEmailVerification } from '@/features/auth/hooks/useEmailVerification';
import { useVerificationSession } from '@/features/auth/hooks/useVerificationSession';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/constants/routes/paths';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [hasVerified, setHasVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  const {
    email: sessionEmail,
    hasSession,
    clearSession,
  } = useVerificationSession();

  const token = searchParams.get('token');

  // Use email verification hook when we have session email but no token
  const emailVerificationHook = useEmailVerification({
    email: sessionEmail || '',
    onVerificationComplete: () => {
      clearSession();
      router.push(ROUTES.AUTH.LOGIN);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run on token or session change
  useEffect(() => {
    // Only run verification once per token
    if (!token || hasVerified) {
      // If no token but we have a session, that's handled in the component return
      if (!hasSession && !token) {
        setStatus('error');
        setMessage(
          'Aucun token de vérification fourni. Veuillez réessayer de vous connecter.',
        );
      }
      return;
    }

    const verify = async () => {
      try {
        setHasVerified(true); // Prevent multiple calls
        await verifyEmail(token);
        setStatus('success');
        setMessage(
          'Email vérifié avec succès. Vous pouvez maintenant vous connecter.',
        );

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(ROUTES.AUTH.LOGIN);
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          (error as Error)?.message || "Échec de la vérification de l'email",
        );
      }
    };

    verify();
    // ESLint disable for this specific case to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hasSession, hasVerified]);

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
                Vérifiez votre email
              </h2>
              <p className="text-gray-600">
                Nous devons vérifier votre adresse email :
              </p>
              <p className="font-medium text-gray-900 mt-1">{sessionEmail}</p>
            </div>

            {emailVerificationHook.canResend && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  Cliquez sur le bouton ci-dessous pour renvoyer un email de
                  vérification. Vérifiez votre boîte de réception, ainsi que
                  votre dossier spam !
                </p>
              </div>
            )}

            {emailVerificationHook.resendSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm">
                  Email de vérification envoyé avec succès ! Vérifiez votre
                  boîte de réception.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={emailVerificationHook.handleResendEmail}
                disabled={
                  !emailVerificationHook.canResend ||
                  emailVerificationHook.isResending
                }
                variant={
                  emailVerificationHook.canResend ? 'default' : 'secondary'
                }
                className="w-full"
              >
                {emailVerificationHook.isResending ? (
                  'Envoi en cours...'
                ) : emailVerificationHook.canResend ? (
                  "Renvoyer l'email de vérification"
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Renvoyer dans{' '}
                      {emailVerificationHook.formatTime(
                        emailVerificationHook.timeLeft,
                      )}
                    </span>
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500">
                Vous n&apos;avez pas reçu l&apos;email ? Vérifiez votre dossier
                spam ou essayez de le renvoyer.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="w-full"
            >
              Retour à la connexion
            </Button>

            <div className="text-xs text-gray-400 border-t pt-4">
              Besoin d&apos;aide ? Contactez le support si vous continuez à
              avoir des problèmes.
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
            <h2 className="text-2xl font-bold">Vérification de l&apos;email</h2>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <p className="text-red-700 mb-4">
              Aucune session de vérification trouvée. Veuillez réessayer de vous
              connecter.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              className="w-full"
            >
              Retour à la connexion
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
      setMessage(
        'Email de vérification envoyé. Veuillez vérifier votre boîte de réception.',
      );
    } catch (error) {
      setMessage(
        (error as Error)?.message ||
          "Échec de l'envoi de l'email de vérification",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Vérification de l&apos;email</h2>

          {status === 'loading' && (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Vérification de votre email...</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <p className="text-green-700 mb-4">{message}</p>
              <p className="text-gray-600">
                Redirection vers la page de connexion...
              </p>
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
                    placeholder="Entrez votre email pour renvoyer la vérification"
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
                  Renvoyer l&apos;email de vérification
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                  className="w-full"
                >
                  Retour à la connexion
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">
                Vérification de l&apos;email
              </h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement...</p>
            </div>
          </Card>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
