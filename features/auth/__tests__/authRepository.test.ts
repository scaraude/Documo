import { AuthRepository } from '../repository/authRepository';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { AuthProvider, Prisma, PrismaClient } from '../../../lib/prisma/generated/client';
import { verifyPassword } from '../utils/password'; // assuming it's imported here
jest.mock('../utils/password'); // mock the whole module


jest.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;
  const mockedVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>;

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
        lastName: 'User'
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
        civilId: null
      });

      const user = await authRepository.createUser(credentials);

      expect(user.email).toBe(credentials.email);
      // Verify password was hashed (not stored in plain text)
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authProviders: expect.objectContaining({
              create: expect.objectContaining({
                passwordHash: expect.not.stringMatching(credentials.password)
              })
            })
          })
        })
      );

    });

    it('should validate correct passwords', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';

      type UserWithAuthProviders = Prisma.UserGetPayload<{
        include: { authProviders: true }
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
        authProviders: [{
          passwordHash: hashedPassword,
          id: 'provider-id',
          userId: 'user-id',
          providerType: 'EMAIL_PASSWORD',
          providerId: email,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerifiedAt: new Date()
        }]
      } as UserWithAuthProviders;

      mockPrisma.user.findFirst.mockResolvedValue(mockedReturnUser);

      mockedVerifyPassword.mockResolvedValue(true);

      const user = await authRepository.authenticateUser({ email, password }) as UserWithAuthProviders;
      expect(user).toBeTruthy();
      expect(user?.email).toBe(email);
      expect(user?.authProviders[0].isVerified).toBe(true);
    });

  });

  describe('Rate Limiting', () => {
    it('should enforce password reset rate limits', async () => {
      const email = 'test@example.com';

      // Mock 3 recent reset attempts
      authRepository.findUserByEmail = jest.fn().mockResolvedValue('user');
      mockPrisma.authProvider.findFirst.mockResolvedValue('authProvider' as unknown as AuthProvider);
      mockPrisma.passwordResetToken.count.mockResolvedValue(3);

      await expect(authRepository.createPasswordResetToken(email))
        .rejects.toThrow('Too many password reset attempts');
    });

    it('should enforce email verification rate limits', async () => {
      const email = 'test@example.com';

      // Mock 3 recent verification attempts
      mockPrisma.emailVerificationToken.count.mockResolvedValue(3);

      await expect(authRepository.createEmailVerificationToken(email))
        .rejects.toThrow('Too many verification attempts');
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
        usedAt: null
      });

      const result = await authRepository.resetPassword('expired-token', 'NewPass123!');
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
        usedAt: usedDate // Already used
      });

      const result = await authRepository.resetPassword('used-token', 'NewPass123!');
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
        ipAddress
      });

      const session = await authRepository.createSession(userId, userAgent, ipAddress);

      expect(session.userId).toBe(userId);
      expect(session.userAgent).toBe(userAgent);
      expect(session.ipAddress).toBe(ipAddress);
    });

    it('should revoke sessions properly', async () => {
      const sessionId = 'session-id';

      await authRepository.revokeSession(sessionId);

      expect(mockPrisma.userSession.update).toHaveBeenCalledWith({
        where: { id: sessionId },
        data: { revokedAt: expect.any(Date) }
      });
    });
  });
});