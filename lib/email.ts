import * as React from 'react';
import { resend } from '@/lib/resend';
import { VerificationEmail } from '@/shared/components/emails/VerificationEmail';
import logger from '@/lib/logger';

interface EmailVerificationOptions {
  to: string;
  firstName: string;
  verificationToken: string;
}

export async function sendVerificationEmail({
  to,
  firstName,
  verificationToken,
}: EmailVerificationOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: 'Document Transfer App <onboarding@resend.dev>',
      to: [to.toLowerCase()],
      subject: 'Verify your email address',
      react: VerificationEmail({
        firstName,
        verificationUrl,
      }) as React.ReactElement,
    });

    if (error) {
      logger.error(
        {
          to: to.replace(/(.{3}).*(@.*)/, '$1...$2'), // Mask email for privacy
          error: error.message
        },
        'Failed to send verification email'
      );
      return { success: false, error: error.message };
    }

    logger.info(
      {
        to: to.replace(/(.{3}).*(@.*)/, '$1...$2'), // Mask email for privacy
        messageId: data?.id,
        operation: 'email.verification.sent'
      },
      'Verification email sent successfully'
    );

    return { success: true };
  } catch (error) {
    const errorMessage = (error as Error).message;
    logger.error(
      {
        to: to.replace(/(.{3}).*(@.*)/, '$1...$2'), // Mask email for privacy
        error: errorMessage
      },
      'Failed to send verification email'
    );
    return { success: false, error: errorMessage };
  }
}

export { resend };
export { VerificationEmail };