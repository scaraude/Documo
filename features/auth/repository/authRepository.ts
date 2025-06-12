import { PrismaClient } from '@prisma/client';
import { ProviderType } from '@/lib/prisma/generated/client';
import logger from '@/lib/logger';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  generateSessionToken,
  generateVerificationToken,
  getSessionExpiryDate,
  getVerificationExpiryDate,
  isTokenExpired,
} from '../utils/tokens';
import type {
  User,
  AuthProvider,
  UserSession,
  EmailVerificationToken,
  SignupCredentials,
  LoginCredentials,
} from '../types';

export class AuthRepository {
  constructor(private prisma: PrismaClient) {}

  async createUser(credentials: SignupCredentials): Promise<User> {
    const { email, password, firstName, lastName } = credentials;

    logger.info({ email, operation: 'user.create' }, 'Creating new user');

    try {
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const hashedPassword = await hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          authProviders: {
            create: {
              providerType: ProviderType.EMAIL_PASSWORD,
              providerId: email,
              passwordHash: hashedPassword,
              isVerified: false,
            },
          },
        },
        include: {
          authProviders: true,
        },
      });

      logger.info({ userId: user.id, operation: 'user.created' }, 'User created successfully');
      return user;
    } catch (error) {
      logger.error({ email, error: (error as Error).message }, 'Failed to create user');
      throw error;
    }
  }

  async authenticateUser(credentials: LoginCredentials): Promise<User | null> {
    const { email, password } = credentials;

    logger.info({ email, operation: 'auth.login' }, 'Authenticating user');

    try {
      const user = await this.prisma.user.findFirst({
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

      if (!user || user.authProviders.length === 0) {
        logger.warn({ email, operation: 'auth.failed' }, 'User not found');
        return null;
      }

      const authProvider = user.authProviders[0];
      if (!authProvider.passwordHash || !authProvider.isVerified) {
        logger.warn({ email, operation: 'auth.failed' }, 'User not verified or no password');
        return null;
      }

      const isValidPassword = await verifyPassword(password, authProvider.passwordHash);
      if (!isValidPassword) {
        logger.warn({ email, operation: 'auth.failed' }, 'Invalid password');
        return null;
      }

      logger.info({ userId: user.id, operation: 'auth.success' }, 'User authenticated successfully');
      return user;
    } catch (error) {
      logger.error({ email, error: (error as Error).message }, 'Authentication error');
      return null;
    }
  }

  async createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<UserSession> {
    logger.info({ userId, operation: 'session.create' }, 'Creating user session');

    try {
      const token = generateSessionToken();
      const expiresAt = getSessionExpiryDate();

      const session = await this.prisma.userSession.create({
        data: {
          userId,
          token,
          expiresAt,
          userAgent,
          ipAddress,
        },
      });

      logger.info({ userId, sessionId: session.id, operation: 'session.created' }, 'Session created');
      return session;
    } catch (error) {
      logger.error({ userId, error: (error as Error).message }, 'Failed to create session');
      throw error;
    }
  }

  async findSessionByToken(token: string): Promise<(UserSession & { user: User }) | null> {
    try {
      const session = await this.prisma.userSession.findFirst({
        where: {
          token,
          revokedAt: null,
        },
        include: {
          user: {
            where: {
              deletedAt: null,
            },
          },
        },
      });

      if (!session || !session.user) {
        return null;
      }

      if (isTokenExpired(session.expiresAt)) {
        logger.info({ sessionId: session.id, operation: 'session.expired' }, 'Session expired');
        await this.revokeSession(session.id);
        return null;
      }

      return session;
    } catch (error) {
      logger.error({ token: token.substring(0, 8) + '...', error: (error as Error).message }, 'Failed to find session');
      return null;
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    logger.info({ sessionId, operation: 'session.revoke' }, 'Revoking session');

    try {
      await this.prisma.userSession.update({
        where: { id: sessionId },
        data: { revokedAt: new Date() },
      });

      logger.info({ sessionId, operation: 'session.revoked' }, 'Session revoked');
    } catch (error) {
      logger.error({ sessionId, error: (error as Error).message }, 'Failed to revoke session');
      throw error;
    }
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    logger.info({ userId, operation: 'session.revokeAll' }, 'Revoking all user sessions');

    try {
      await this.prisma.userSession.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });

      logger.info({ userId, operation: 'session.allRevoked' }, 'All user sessions revoked');
    } catch (error) {
      logger.error({ userId, error: (error as Error).message }, 'Failed to revoke all sessions');
      throw error;
    }
  }

  async createEmailVerificationToken(email: string): Promise<EmailVerificationToken> {
    logger.info({ email, operation: 'verification.create' }, 'Creating email verification token');

    try {
      // Clean up any existing tokens for this email
      await this.prisma.emailVerificationToken.deleteMany({
        where: { email },
      });

      const token = generateVerificationToken();
      const expiresAt = getVerificationExpiryDate();

      const verificationToken = await this.prisma.emailVerificationToken.create({
        data: {
          email,
          token,
          expiresAt,
        },
      });

      logger.info({ email, operation: 'verification.created' }, 'Verification token created');
      return verificationToken;
    } catch (error) {
      logger.error({ email, error: (error as Error).message }, 'Failed to create verification token');
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    logger.info({ token: token.substring(0, 8) + '...', operation: 'verification.verify' }, 'Verifying email token');

    try {
      const verificationToken = await this.prisma.emailVerificationToken.findFirst({
        where: {
          token,
          usedAt: null,
        },
      });

      if (!verificationToken) {
        logger.warn({ token: token.substring(0, 8) + '...', operation: 'verification.failed' }, 'Token not found');
        return false;
      }

      if (isTokenExpired(verificationToken.expiresAt)) {
        logger.warn({ token: token.substring(0, 8) + '...', operation: 'verification.expired' }, 'Token expired');
        return false;
      }

      // Mark token as used
      await this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      });

      // Update auth provider to verified
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

      logger.info({ email: verificationToken.email, operation: 'verification.success' }, 'Email verified successfully');
      return true;
    } catch (error) {
      logger.error({ token: token.substring(0, 8) + '...', error: (error as Error).message }, 'Email verification failed');
      return false;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          email,
          deletedAt: null,
        },
      });
    } catch (error) {
      logger.error({ email, error: (error as Error).message }, 'Failed to find user by email');
      return null;
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });
    } catch (error) {
      logger.error({ userId: id, error: (error as Error).message }, 'Failed to find user by ID');
      return null;
    }
  }
}