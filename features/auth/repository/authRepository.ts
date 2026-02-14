import logger from '@/lib/logger';
import { type PrismaClient, ProviderType } from '@/lib/prisma/generated/client';
import type {
  EmailVerificationToken,
  LoginCredentials,
  Organization,
  OrganizationSession,
  SignupCredentials,
} from '../types';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  generatePasswordResetToken,
  generateSessionToken,
  generateVerificationToken,
  getPasswordResetExpiryDate,
  getSessionExpiryDate,
  getVerificationExpiryDate,
  isTokenExpired,
} from '../utils/tokens';

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async createOrganization(
    credentials: SignupCredentials,
  ): Promise<Organization> {
    const { email, password, organizationName } = credentials;

    logger.info(
      { email, operation: 'organization.create' },
      'Creating new organization',
    );

    try {
      const existingOrganization = await this.findOrganizationByEmail(email);
      if (existingOrganization) {
        throw new Error('Organization already exists with this email');
      }

      const hashedPassword = await hashPassword(password);

      const organization = await this.prisma.organization.create({
        data: {
          email,
          name: organizationName,
          authProviders: {
            create: {
              providerType: ProviderType.EMAIL_PASSWORD,
              providerId: email,
              passwordHash: hashedPassword,
              isVerified: false,
            },
          },
        },
      });

      logger.info(
        { organizationId: organization.id, operation: 'organization.created' },
        'Organization created successfully',
      );
      return organization;
    } catch (error) {
      logger.error(
        { email, error: (error as Error).message },
        'Failed to create organization',
      );
      throw error;
    }
  }

  async authenticateOrganization(
    credentials: LoginCredentials,
  ): Promise<Organization | null> {
    const { email, password } = credentials;

    logger.info(
      { email, operation: 'auth.login' },
      'Authenticating organization',
    );

    try {
      const organization = await this.prisma.organization.findFirst({
        where: {
          email,
          deletedAt: null,
        },
        include: {
          authProviders: {
            where: {
              providerType: ProviderType.EMAIL_PASSWORD,
            },
          },
        },
      });

      if (!organization || organization.authProviders.length === 0) {
        logger.warn(
          { email, operation: 'auth.failed' },
          'Organization not found',
        );
        return null;
      }

      const authProvider = organization.authProviders[0];
      if (!authProvider.passwordHash) {
        logger.warn(
          { email, operation: 'auth.failed' },
          'No password hash found',
        );
        return null;
      }

      const isValidPassword = await verifyPassword(
        password,
        authProvider.passwordHash,
      );
      if (!isValidPassword) {
        logger.warn({ email, operation: 'auth.failed' }, 'Invalid password');
        return null;
      }

      if (!authProvider.isVerified) {
        logger.warn(
          { email, operation: 'auth.unverified' },
          'Organization email not verified',
        );
        throw new Error('UNVERIFIED_EMAIL');
      }

      logger.info(
        { organizationId: organization.id, operation: 'auth.success' },
        'Organization authenticated successfully',
      );
      return organization;
    } catch (error) {
      if ((error as Error).message === 'UNVERIFIED_EMAIL') {
        throw error;
      }

      logger.error(
        { email, error: (error as Error).message },
        'Authentication error',
      );
      return null;
    }
  }

  async createSession(
    organizationId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<OrganizationSession> {
    logger.info(
      { organizationId, operation: 'session.create' },
      'Creating organization session',
    );

    try {
      const token = generateSessionToken();
      const expiresAt = getSessionExpiryDate();

      const session = await this.prisma.organizationSession.create({
        data: {
          organizationId,
          token,
          expiresAt,
          userAgent,
          ipAddress,
        },
      });

      logger.info(
        {
          organizationId,
          sessionId: session.id,
          operation: 'session.created',
        },
        'Session created',
      );
      return session;
    } catch (error) {
      logger.error(
        { organizationId, error: (error as Error).message },
        'Failed to create session',
      );
      throw error;
    }
  }

  async findSessionByToken(
    token: string,
  ): Promise<(OrganizationSession & { organization: Organization }) | null> {
    try {
      const session = await this.prisma.organizationSession.findFirst({
        where: {
          token,
          revokedAt: null,
          organization: { deletedAt: null },
        },
        include: {
          organization: true,
        },
      });

      if (!session || !session.organization) {
        return null;
      }

      if (isTokenExpired(session.expiresAt)) {
        logger.info(
          { sessionId: session.id, operation: 'session.expired' },
          'Session expired',
        );
        await this.revokeSession(session.id);
        return null;
      }

      return session;
    } catch (error) {
      logger.error(
        {
          token: `${token.substring(0, 8)}...`,
          error: (error as Error).message,
        },
        'Failed to find session',
      );
      return null;
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    logger.info({ sessionId, operation: 'session.revoke' }, 'Revoking session');

    try {
      await this.prisma.organizationSession.update({
        where: { id: sessionId },
        data: { revokedAt: new Date() },
      });

      logger.info(
        { sessionId, operation: 'session.revoked' },
        'Session revoked',
      );
    } catch (error) {
      logger.error(
        { sessionId, error: (error as Error).message },
        'Failed to revoke session',
      );
      throw error;
    }
  }

  async revokeAllOrganizationSessions(organizationId: string): Promise<void> {
    logger.info(
      { organizationId, operation: 'session.revokeAll' },
      'Revoking all organization sessions',
    );

    try {
      await this.prisma.organizationSession.updateMany({
        where: {
          organizationId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });

      logger.info(
        { organizationId, operation: 'session.allRevoked' },
        'All organization sessions revoked',
      );
    } catch (error) {
      logger.error(
        { organizationId, error: (error as Error).message },
        'Failed to revoke all sessions',
      );
      throw error;
    }
  }

  async createEmailVerificationToken(
    email: string,
  ): Promise<EmailVerificationToken> {
    logger.info(
      { email, operation: 'verification.create' },
      'Creating email verification token',
    );

    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentAttempts = await this.prisma.emailVerificationToken.count({
        where: {
          email,
          createdAt: {
            gte: fifteenMinutesAgo,
          },
        },
      });

      if (recentAttempts >= 3) {
        logger.warn(
          {
            email,
            attempts: recentAttempts,
            operation: 'verification.rate_limited',
          },
          'Too many verification attempts',
        );
        throw new Error(
          'Too many verification attempts. Please wait 15 minutes before trying again.',
        );
      }

      await this.prisma.emailVerificationToken.deleteMany({
        where: {
          email,
          usedAt: null,
        },
      });

      const token = generateVerificationToken();
      const expiresAt = getVerificationExpiryDate();

      const verificationToken = await this.prisma.emailVerificationToken.create(
        {
          data: {
            email,
            token,
            expiresAt,
          },
        },
      );

      logger.info(
        { email, operation: 'verification.created' },
        'Verification token created',
      );
      return verificationToken;
    } catch (error) {
      logger.error(
        { email, error: (error as Error).message },
        'Failed to create verification token',
      );
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    logger.info(
      {
        token: `${token.substring(0, 8)}...`,
        operation: 'verification.verify',
      },
      'Verifying email token',
    );

    try {
      const verificationToken =
        await this.prisma.emailVerificationToken.findFirst({
          where: {
            token,
            usedAt: null,
          },
        });

      if (!verificationToken) {
        logger.warn(
          {
            token: `${token.substring(0, 8)}...`,
            operation: 'verification.failed',
          },
          'Token not found',
        );
        return false;
      }

      if (isTokenExpired(verificationToken.expiresAt)) {
        logger.warn(
          {
            token: `${token.substring(0, 8)}...`,
            operation: 'verification.expired',
          },
          'Token expired',
        );
        return false;
      }

      await this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      });

      await this.prisma.authProvider.updateMany({
        where: {
          providerType: ProviderType.EMAIL_PASSWORD,
          providerId: verificationToken.email,
        },
        data: {
          isVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      logger.info(
        { email: verificationToken.email, operation: 'verification.success' },
        'Email verified successfully',
      );
      return true;
    } catch (error) {
      logger.error(
        {
          token: `${token.substring(0, 8)}...`,
          error: (error as Error).message,
        },
        'Email verification failed',
      );
      return false;
    }
  }

  async findOrganizationByEmail(email: string): Promise<Organization | null> {
    try {
      return await this.prisma.organization.findFirst({
        where: {
          email,
          deletedAt: null,
        },
      });
    } catch (error) {
      logger.error(
        { email, error: (error as Error).message },
        'Failed to find organization by email',
      );
      return null;
    }
  }

  async findOrganizationById(id: string): Promise<Organization | null> {
    try {
      return await this.prisma.organization.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });
    } catch (error) {
      logger.error(
        { organizationId: id, error: (error as Error).message },
        'Failed to find organization by ID',
      );
      return null;
    }
  }

  async isEmailVerified(email: string): Promise<boolean> {
    try {
      const authProvider = await this.prisma.authProvider.findFirst({
        where: {
          providerType: ProviderType.EMAIL_PASSWORD,
          providerId: email,
        },
      });

      return authProvider?.isVerified || false;
    } catch (error) {
      logger.error(
        { email, error: (error as Error).message },
        'Failed to check email verification status',
      );
      return false;
    }
  }

  async createPasswordResetToken(email: string): Promise<{ token: string }> {
    logger.info(
      { email, operation: 'password_reset.create_token' },
      'Creating password reset token',
    );

    try {
      const organization = await this.findOrganizationByEmail(email);
      if (!organization) {
        logger.info(
          { email, operation: 'password_reset.email_not_found' },
          'Email not found for password reset',
        );
        return { token: 'fake-token' };
      }

      const authProvider = await this.prisma.authProvider.findFirst({
        where: {
          providerType: ProviderType.EMAIL_PASSWORD,
          providerId: email,
        },
      });

      if (!authProvider) {
        logger.info(
          { email, operation: 'password_reset.no_email_provider' },
          'No email provider found',
        );
        return { token: 'fake-token' };
      }

      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const recentAttempts = await this.prisma.passwordResetToken.count({
        where: {
          email,
          createdAt: {
            gte: fifteenMinutesAgo,
          },
        },
      });

      if (recentAttempts >= 3) {
        logger.warn(
          {
            email,
            attempts: recentAttempts,
            operation: 'password_reset.rate_limited',
          },
          'Too many reset attempts',
        );
        throw new Error(
          'Too many password reset attempts. Please wait 15 minutes before trying again.',
        );
      }

      await this.prisma.passwordResetToken.deleteMany({
        where: {
          email,
          usedAt: null,
        },
      });

      const token = generatePasswordResetToken();
      const expiresAt = getPasswordResetExpiryDate();

      await this.prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expiresAt,
        },
      });

      logger.info(
        { email, operation: 'password_reset.token_created' },
        'Password reset token created',
      );
      return { token };
    } catch (error) {
      logger.error(
        { email, error: (error as Error).message },
        'Failed to create password reset token',
      );
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    logger.info(
      {
        token: `${token.substring(0, 8)}...`,
        operation: 'password_reset.reset',
      },
      'Resetting password',
    );

    try {
      const resetToken = await this.prisma.passwordResetToken.findFirst({
        where: {
          token,
        },
      });

      if (!resetToken) {
        logger.warn(
          {
            token: `${token.substring(0, 8)}...`,
            operation: 'password_reset.token_not_found',
          },
          'Reset token not found',
        );
        return false;
      }

      if (resetToken.usedAt) {
        logger.warn(
          {
            token: `${token.substring(0, 8)}...`,
            operation: 'password_reset.token_used',
          },
          'Reset token already used',
        );
        return false;
      }

      if (isTokenExpired(resetToken.expiresAt)) {
        logger.warn(
          {
            token: `${token.substring(0, 8)}...`,
            operation: 'password_reset.token_expired',
          },
          'Reset token expired',
        );
        return false;
      }

      await this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      });

      const hashedPassword = await hashPassword(newPassword);
      await this.prisma.authProvider.updateMany({
        where: {
          providerType: ProviderType.EMAIL_PASSWORD,
          providerId: resetToken.email,
        },
        data: {
          passwordHash: hashedPassword,
          updatedAt: new Date(),
        },
      });

      await this.prisma.organizationSession.updateMany({
        where: {
          organization: {
            email: resetToken.email,
          },
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      logger.info(
        { email: resetToken.email, operation: 'password_reset.success' },
        'Password reset successfully',
      );
      return true;
    } catch (error) {
      logger.error(
        {
          token: `${token.substring(0, 8)}...`,
          error: (error as Error).message,
        },
        'Password reset failed',
      );
      return false;
    }
  }
}
