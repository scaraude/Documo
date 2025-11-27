import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type DeepMockProxy, mockDeep, mockReset } from 'vitest-mock-extended';
import type {
  AuthProvider,
  Prisma,
  PrismaClient,
} from '../../../lib/prisma/generated/client';
import { AuthRepository } from '../repository/authRepository';
import { verifyPassword } from '../utils/password';

vi.mock('../utils/password');

vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;
  const mockedVerifyPassword = vi.mocked(verifyPassword);

  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    authRepository = new AuthRepository(mockPrisma);
    mockReset(mockPrisma);
  });

  describe('Password Security', () => {
    it('should hash passwords correctly', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPrisma.user.findFirst.mockResolvedValue(null); // No existing user
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-id',
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        civilId: null,
      });

      const user = await authRepository.createUser(credentials);

      expect(user.email).toBe(credentials.email);
      // Verify password was hashed (not stored in plain text)
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authProviders: expect.objectContaining({
              create: expect.objectContaining({
                passwordHash: expect.not.stringMatching(credentials.password),
              }),
            }),
          }),
        }),
      );
    });

    it('should validate correct passwords', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';

      type UserWithAuthProviders = Prisma.UserGetPayload<{
        include: { authProviders: true };
      }>;
      // Mock user with hashed password
      const hashedPassword = '$2b$12$hashedpassword...';
      const mockedReturnUser = {
        id: 'user-id',
        email,
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        civilId: null,
        authProviders: [
          {
            passwordHash: hashedPassword,
            id: 'provider-id',
            userId: 'user-id',
            providerType: 'EMAIL_PASSWORD',
            providerId: email,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            emailVerifiedAt: new Date(),
          },
        ],
      } as UserWithAuthProviders;

      mockPrisma.user.findFirst.mockResolvedValue(mockedReturnUser);

      mockedVerifyPassword.mockResolvedValue(true);

      const user = (await authRepository.authenticateUser({
        email,
        password,
      })) as UserWithAuthProviders;
      expect(user).toBeTruthy();
      expect(user?.email).toBe(email);
      expect(user?.authProviders[0].isVerified).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce password reset rate limits', async () => {
      const email = 'test@example.com';

      // Mock 3 recent reset attempts
      authRepository.findUserByEmail = vi.fn().mockResolvedValue('user');
      mockPrisma.authProvider.findFirst.mockResolvedValue(
        'authProvider' as unknown as AuthProvider,
      );
      mockPrisma.passwordResetToken.count.mockResolvedValue(3);

      await expect(
        authRepository.createPasswordResetToken(email),
      ).rejects.toThrow('Too many password reset attempts');
    });

    it('should enforce email verification rate limits', async () => {
      const email = 'test@example.com';

      // Mock 3 recent verification attempts
      mockPrisma.emailVerificationToken.count.mockResolvedValue(3);

      await expect(
        authRepository.createEmailVerificationToken(email),
      ).rejects.toThrow('Too many verification attempts');
    });
  });

  describe('Token Security', () => {
    it('should expire tokens correctly', async () => {
      const expiredDate = new Date(Date.now() - 1000); // 1 second ago

      mockPrisma.passwordResetToken.findFirst.mockResolvedValue({
        id: 'token-id',
        email: 'test@example.com',
        token: 'expired-token',
        expiresAt: expiredDate,
        createdAt: new Date(),
        usedAt: null,
      });

      const result = await authRepository.resetPassword(
        'expired-token',
        'NewPass123!',
      );
      expect(result).toBe(false);
    });

    it('should not reuse tokens', async () => {
      const usedDate = new Date();

      mockPrisma.passwordResetToken.findFirst.mockResolvedValue({
        id: 'token-id',
        email: 'test@example.com',
        token: 'used-token',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
        usedAt: usedDate, // Already used
      });

      const result = await authRepository.resetPassword(
        'used-token',
        'NewPass123!',
      );
      expect(result).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should create sessions with proper expiry', async () => {
      const userId = 'user-id';
      const userAgent = 'Mozilla/5.0...';
      const ipAddress = '192.168.1.1';

      mockPrisma.userSession.create.mockResolvedValue({
        id: 'session-id',
        userId,
        token: 'session-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        revokedAt: null,
        userAgent,
        ipAddress,
      });

      const session = await authRepository.createSession(
        userId,
        userAgent,
        ipAddress,
      );

      expect(session.userId).toBe(userId);
      expect(session.userAgent).toBe(userAgent);
      expect(session.ipAddress).toBe(ipAddress);
    });

    it('should revoke sessions properly', async () => {
      const sessionId = 'session-id';

      await authRepository.revokeSession(sessionId);

      expect(mockPrisma.userSession.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should find valid session by token', async () => {
      const token = 'valid-session-token';
      const userId = 'user-id';
      const futureDate = new Date(Date.now() + 60000);

      const mockSession = {
        id: 'session-id',
        userId,
        token,
        expiresAt: futureDate,
        createdAt: new Date(),
        revokedAt: null,
        userAgent: 'Mozilla/5.0...',
        ipAddress: '192.168.1.1',
        user: {
          id: userId,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          civilId: null,
        },
      };

      mockPrisma.userSession.findFirst.mockResolvedValue(mockSession);

      const result = await authRepository.findSessionByToken(token);

      expect(result).toEqual(mockSession);
      expect(mockPrisma.userSession.findFirst).toHaveBeenCalledWith({
        where: {
          token,
          revokedAt: null,
          user: { deletedAt: null },
        },
        include: {
          user: true,
        },
      });
    });

    it('should return null for expired session', async () => {
      const token = 'expired-session-token';
      const expiredDate = new Date(Date.now() - 60000);

      type UseSessionWithUser = Prisma.UserSessionGetPayload<{
        include: { user: true };
      }>;

      mockPrisma.userSession.findFirst.mockResolvedValue({
        id: 'session-id',
        userId: 'user-id',
        token,
        expiresAt: expiredDate,
        createdAt: new Date(),
        revokedAt: null,
        userAgent: 'Mozilla/5.0...',
        ipAddress: '192.168.1.1',
        user: {
          id: 'user-id',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          civilId: null,
        },
      } as UseSessionWithUser);

      const result = await authRepository.findSessionByToken(token);

      expect(result).toBeNull();
      expect(mockPrisma.userSession.update).toHaveBeenCalledWith({
        where: { id: 'session-id' },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should revoke all user sessions', async () => {
      const userId = 'user-id';

      await authRepository.revokeAllUserSessions(userId);

      expect(mockPrisma.userSession.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe('Email Verification', () => {
    it('should verify email with valid token', async () => {
      const token = 'valid-verification-token';
      const email = 'test@example.com';
      const futureDate = new Date(Date.now() + 60000);

      mockPrisma.emailVerificationToken.findFirst.mockResolvedValue({
        id: 'token-id',
        email,
        token,
        expiresAt: futureDate,
        createdAt: new Date(),
        usedAt: null,
      });

      const result = await authRepository.verifyEmail(token);

      expect(result).toBe(true);
      expect(mockPrisma.emailVerificationToken.update).toHaveBeenCalledWith({
        where: { id: 'token-id' },
        data: { usedAt: expect.any(Date) },
      });
      expect(mockPrisma.authProvider.updateMany).toHaveBeenCalledWith({
        where: {
          providerType: 'EMAIL_PASSWORD',
          providerId: email,
        },
        data: {
          isVerified: true,
          emailVerifiedAt: expect.any(Date),
        },
      });
    });

    it('should reject expired verification token', async () => {
      const token = 'expired-verification-token';
      const expiredDate = new Date(Date.now() - 60000);

      mockPrisma.emailVerificationToken.findFirst.mockResolvedValue({
        id: 'token-id',
        email: 'test@example.com',
        token,
        expiresAt: expiredDate,
        createdAt: new Date(),
        usedAt: null,
      });

      const result = await authRepository.verifyEmail(token);

      expect(result).toBe(false);
    });

    it('should reject invalid verification token', async () => {
      const token = 'invalid-token';

      mockPrisma.emailVerificationToken.findFirst.mockResolvedValue(null);

      const result = await authRepository.verifyEmail(token);

      expect(result).toBe(false);
    });
  });

  describe('User Management', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user-id',
        email,
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        civilId: null,
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await authRepository.findUserByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email,
          deletedAt: null,
        },
      });
    });

    it('should find user by id', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        civilId: null,
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await authRepository.findUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: userId,
          deletedAt: null,
        },
      });
    });

    it('should check email verification status', async () => {
      const email = 'test@example.com';

      mockPrisma.authProvider.findFirst.mockResolvedValue({
        id: 'provider-id',
        userId: 'user-id',
        providerType: 'EMAIL_PASSWORD',
        providerId: email,
        passwordHash: 'hash',
        providerData: {},
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerifiedAt: new Date(),
      });

      const result = await authRepository.isEmailVerified(email);

      expect(result).toBe(true);
    });

    it('should return false for unverified email', async () => {
      const email = 'unverified@example.com';

      mockPrisma.authProvider.findFirst.mockResolvedValue({
        id: 'provider-id',
        userId: 'user-id',
        providerType: 'EMAIL_PASSWORD',
        providerId: email,
        passwordHash: 'hash',
        providerData: {},
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerifiedAt: null,
      });

      const result = await authRepository.isEmailVerified(email);

      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully in findUserByEmail', async () => {
      const email = 'test@example.com';

      mockPrisma.user.findFirst.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await authRepository.findUserByEmail(email);

      expect(result).toBeNull();
    });

    it('should handle database errors gracefully in findUserById', async () => {
      const userId = 'user-id';

      mockPrisma.user.findFirst.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await authRepository.findUserById(userId);

      expect(result).toBeNull();
    });

    it('should handle database errors gracefully in isEmailVerified', async () => {
      const email = 'test@example.com';

      mockPrisma.authProvider.findFirst.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await authRepository.isEmailVerified(email);

      expect(result).toBe(false);
    });
  });
});
