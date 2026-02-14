import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type DeepMockProxy, mockDeep, mockReset } from 'vitest-mock-extended';
import type { PrismaClient } from '../../../lib/prisma/generated/client';
import { AuthRepository } from '../repository/authRepository';
import { verifyPassword } from '../utils/password';

vi.mock('../utils/password');

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;
  const mockedVerifyPassword = vi.mocked(verifyPassword);

  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>();
    authRepository = new AuthRepository(mockPrisma);
    mockReset(mockPrisma);
  });

  it('creates an organization with password auth provider', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      organizationName: 'Acme',
    };

    mockPrisma.organization.findFirst.mockResolvedValue(null);
    mockPrisma.organization.create.mockResolvedValue({
      id: 'org-id',
      email: credentials.email,
      name: credentials.organizationName,
      civilId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const organization = await authRepository.createOrganization(credentials);

    expect(organization.email).toBe(credentials.email);
    expect(mockPrisma.organization.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: credentials.email,
          name: credentials.organizationName,
          authProviders: expect.objectContaining({
            create: expect.objectContaining({
              providerType: 'EMAIL_PASSWORD',
              providerId: credentials.email,
            }),
          }),
        }),
      }),
    );
  });

  it('authenticates a verified organization with valid password', async () => {
    const email = 'test@example.com';
    const password = 'SecurePass123!';
    const mockedOrganization = {
      id: 'org-id',
      email,
      name: 'Acme',
      civilId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviders: [
        {
          id: 'provider-id',
          organizationId: 'org-id',
          providerType: 'EMAIL_PASSWORD',
          providerId: email,
          providerData: null,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          passwordHash: '$2b$12$hashed...',
          emailVerifiedAt: new Date(),
        },
      ],
    };

    mockPrisma.organization.findFirst.mockResolvedValue(mockedOrganization);
    mockedVerifyPassword.mockResolvedValue(true);

    const organization = await authRepository.authenticateOrganization({
      email,
      password,
    });

    expect(organization?.id).toBe('org-id');
  });

  it('creates and revokes sessions', async () => {
    mockPrisma.organizationSession.create.mockResolvedValue({
      id: 'session-id',
      organizationId: 'org-id',
      token: 'session-token',
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      revokedAt: null,
      userAgent: null,
      ipAddress: null,
    });

    const session = await authRepository.createSession('org-id');
    expect(session.organizationId).toBe('org-id');

    await authRepository.revokeSession('session-id');
    expect(mockPrisma.organizationSession.update).toHaveBeenCalledWith({
      where: { id: 'session-id' },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('returns null and revokes expired session tokens', async () => {
    mockPrisma.organizationSession.findFirst.mockResolvedValue(
      {
        id: 'session-id',
        organizationId: 'org-id',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 60_000),
        createdAt: new Date(),
        revokedAt: null,
        userAgent: null,
        ipAddress: null,
        organization: {
          id: 'org-id',
          email: 'test@example.com',
          name: 'Acme',
          civilId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      } as any,
    );

    const result = await authRepository.findSessionByToken('expired-token');
    expect(result).toBeNull();
    expect(mockPrisma.organizationSession.update).toHaveBeenCalledWith({
      where: { id: 'session-id' },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('enforces reset token rate limits', async () => {
    mockPrisma.organization.findFirst.mockResolvedValue({
      id: 'org-id',
      email: 'test@example.com',
      name: 'Acme',
      civilId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    mockPrisma.authProvider.findFirst.mockResolvedValue({
      id: 'provider-id',
      organizationId: 'org-id',
      providerType: 'EMAIL_PASSWORD',
      providerId: 'test@example.com',
      providerData: null,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash: 'hash',
      emailVerifiedAt: new Date(),
    });
    mockPrisma.passwordResetToken.count.mockResolvedValue(3);

    await expect(
      authRepository.createPasswordResetToken('test@example.com'),
    ).rejects.toThrow('Too many password reset attempts');
  });

  it('returns success for already-used verification token if email is already verified', async () => {
    const usedAt = new Date();

    mockPrisma.emailVerificationToken.findFirst.mockResolvedValue({
      id: 'verification-token-id',
      email: 'verified@example.com',
      token: 'used-token',
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      usedAt,
    });

    mockPrisma.authProvider.findFirst.mockResolvedValue({
      id: 'provider-id',
      organizationId: 'org-id',
      providerType: 'EMAIL_PASSWORD',
      providerId: 'verified@example.com',
      providerData: null,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash: '$2b$12$hashed...',
      emailVerifiedAt: new Date(),
    });

    const result = await authRepository.verifyEmail('used-token');

    expect(result).toBe(true);
    expect(mockPrisma.emailVerificationToken.update).not.toHaveBeenCalled();
    expect(mockPrisma.authProvider.updateMany).not.toHaveBeenCalled();
  });

  it('returns false for expired verification token even if it was already used', async () => {
    mockPrisma.emailVerificationToken.findFirst.mockResolvedValue({
      id: 'verification-token-id',
      email: 'verified@example.com',
      token: 'expired-used-token',
      expiresAt: new Date(Date.now() - 60_000),
      createdAt: new Date(),
      usedAt: new Date(Date.now() - 120_000),
    });

    const result = await authRepository.verifyEmail('expired-used-token');

    expect(result).toBe(false);
    expect(mockPrisma.authProvider.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.emailVerificationToken.update).not.toHaveBeenCalled();
    expect(mockPrisma.authProvider.updateMany).not.toHaveBeenCalled();
  });
});
