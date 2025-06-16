import * as React from 'react';
import { resend } from '@/lib/resend';
import { VerificationEmail } from '@/shared/components/emails/VerificationEmail';
import { DocumentRequestEmail } from '@/shared/components/emails/DocumentRequestEmail';
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
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: `Documo <${process.env.FROM_EMAIL}>`,
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
        operation: sendVerificationEmail.name
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

interface DocumentRequestEmailOptions {
  to: string;
  requesterName?: string;
  requestedDocuments: string[];
  uploadUrl: string;
  expirationDate: string;
  folderName: string;
}

export async function sendDocumentRequestEmail({
  to,
  requesterName,
  requestedDocuments,
  uploadUrl,
  expirationDate,
  folderName,
}: DocumentRequestEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: `Documo <${process.env.FROM_EMAIL}>`,
      to: [to.toLowerCase()],
      subject: `Demande de documents - ${folderName}`,
      react: DocumentRequestEmail({
        recipientEmail: to,
        requesterName,
        requestedDocuments,
        uploadUrl,
        expirationDate,
        folderName,
      }) as React.ReactElement,
    });

    if (error) {
      logger.error(
        {
          to: to.replace(/(.{3}).*(@.*)/, '$1...$2'),
          error: error.message,
          operation: 'email.document_request.failed'
        },
        'Failed to send document request email'
      );
      return { success: false, error: error.message };
    }

    logger.info(
      {
        to: to.replace(/(.{3}).*(@.*)/, '$1...$2'),
        messageId: data?.id,
        folderName,
        documentsCount: requestedDocuments.length,
        operation: 'email.document_request.sent'
      },
      'Document request email sent successfully'
    );

    return { success: true };
  } catch (error) {
    const errorMessage = (error as Error).message;
    logger.error(
      {
        to: to.replace(/(.{3}).*(@.*)/, '$1...$2'),
        error: errorMessage,
        operation: 'email.document_request.failed'
      },
      'Failed to send document request email'
    );
    return { success: false, error: errorMessage };
  }
}

export { resend };
export { VerificationEmail };
export { DocumentRequestEmail };