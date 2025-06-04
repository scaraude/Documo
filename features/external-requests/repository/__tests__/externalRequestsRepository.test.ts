import {
    createShareLink,
    getShareLinkByToken,
    deleteExpiredShareLinks
} from '../externalRequestsRepository';
import prisma from '@/lib/prisma';
import { CreateShareLinkParams } from '../../types/api';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        requestShareLink: {
            create: jest.fn(),
            findFirst: jest.fn(),
            deleteMany: jest.fn(),
        }
    }
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma> & {
    requestShareLink: {
        create: jest.Mock;
        findFirst: jest.Mock;
        deleteMany: jest.Mock;
    }
};

describe('External Requests Repository', () => {
    const mockDate = new Date('2025-06-04');
    const futureDate = new Date('2025-06-11');

    const mockShareLink = {
        id: '1',
        requestId: 'req-123',
        token: 'test-token',
        expiresAt: futureDate,
        createdAt: mockDate,
        request: {
            id: 'req-123',
            civilId: 'civ-123',
            requestedDocuments: ['ID_CARD'],
            createdAt: mockDate,
            expiresAt: futureDate,
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('createShareLink', () => {
        it('should create a new share link with correct expiration', async () => {
            const params: CreateShareLinkParams = {
                requestId: 'req-123',
                token: 'test-token',
                expiresAt: futureDate
            };

            mockPrisma.requestShareLink.create.mockResolvedValue(mockShareLink);

            const result = await createShareLink(params);

            expect(mockPrisma.requestShareLink.create).toHaveBeenCalledWith({
                data: {
                    requestId: params.requestId,
                    token: params.token,
                    expiresAt: params.expiresAt,
                }
            });
            expect(result).toEqual(mockShareLink);
        });

        it('should throw error if creation fails', async () => {
            const params: CreateShareLinkParams = {
                requestId: 'req-123',
                token: 'test-token',
                expiresAt: futureDate
            };

            mockPrisma.requestShareLink.create.mockRejectedValue(new Error('Database error'));

            await expect(createShareLink(params)).rejects.toThrow('Database error');
        });
    });

    describe('getShareLinkByToken', () => {
        it('should return null for non-existent token', async () => {
            mockPrisma.requestShareLink.findFirst.mockResolvedValue(null);

            const result = await getShareLinkByToken('non-existent-token');

            expect(mockPrisma.requestShareLink.findFirst).toHaveBeenCalledWith({
                where: {
                    token: 'non-existent-token',
                    expiresAt: {
                        gt: mockDate
                    }
                },
                include: {
                    request: true
                }
            });
            expect(result).toBeNull();
        });

        it('should return share link with request data for valid token', async () => {
            mockPrisma.requestShareLink.findFirst.mockResolvedValue(mockShareLink);

            const result = await getShareLinkByToken('test-token');

            expect(mockPrisma.requestShareLink.findFirst).toHaveBeenCalledWith({
                where: {
                    token: 'test-token',
                    expiresAt: {
                        gt: mockDate
                    }
                },
                include: {
                    request: true
                }
            });
            expect(result).toEqual(mockShareLink);
        });
    });

    describe('deleteExpiredShareLinks', () => {
        it('should delete only expired share links', async () => {
            mockPrisma.requestShareLink.deleteMany.mockResolvedValue({ count: 2 });

            const result = await deleteExpiredShareLinks();

            expect(mockPrisma.requestShareLink.deleteMany).toHaveBeenCalledWith({
                where: {
                    expiresAt: {
                        lt: mockDate
                    }
                }
            });
            expect(result).toEqual({ count: 2 });
        });

        it('should handle no expired links', async () => {
            mockPrisma.requestShareLink.deleteMany.mockResolvedValue({ count: 0 });

            const result = await deleteExpiredShareLinks();

            expect(result).toEqual({ count: 0 });
        });
    });
});
