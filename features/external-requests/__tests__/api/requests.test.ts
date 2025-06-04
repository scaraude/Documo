import { NextRequest } from 'next/server';
import { GET } from '../../../app/api/external/requests/[token]/route';
import { POST } from '../../../app/api/external/share-link/[id]/route';
import * as externalRequestsRepository from '../repository/externalRequestsRepository';

// Mock the external requests repository
jest.mock('../repository/externalRequestsRepository', () => ({
    getShareLinkByToken: jest.fn(),
    createShareLink: jest.fn()
}));

describe('External Request API Endpoints', () => {
    const mockDate = new Date('2025-06-04');

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('GET /api/external/requests/[token]', () => {
        const mockRequest = {
            id: 'req-123',
            civilId: 'civ-123',
            requestedDocuments: ['ID_CARD'],
            createdAt: mockDate,
            expiresAt: new Date('2025-06-11'),
            status: 'PENDING'
        };

        const mockShareLink = {
            id: 'link-123',
            token: 'valid-token',
            requestId: 'req-123',
            expiresAt: new Date('2025-06-11'),
            request: mockRequest
        };

        it('should return 404 for invalid token', async () => {
            (externalRequestsRepository.getShareLinkByToken as jest.Mock).mockResolvedValue(null);

            const response = await GET(
                new NextRequest(new Request('http://localhost:3000')),
                { params: { token: 'invalid-token' } }
            );

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data).toEqual({ error: 'Request not found' });
        });

        it('should return request data for valid token', async () => {
            (externalRequestsRepository.getShareLinkByToken as jest.Mock).mockResolvedValue(mockShareLink);

            const response = await GET(
                new NextRequest(new Request('http://localhost:3000')),
                { params: { token: 'valid-token' } }
            );

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({
                id: mockRequest.id,
                civilId: mockRequest.civilId,
                requestedDocuments: mockRequest.requestedDocuments,
                createdAt: mockRequest.createdAt.toISOString(),
                expiresAt: mockRequest.expiresAt.toISOString()
            });
            // Should not include status in external response
            expect(data).not.toHaveProperty('status');
        });

        it('should handle repository errors', async () => {
            (externalRequestsRepository.getShareLinkByToken as jest.Mock)
                .mockRejectedValue(new Error('Database error'));

            const response = await GET(
                new NextRequest(new Request('http://localhost:3000')),
                { params: { token: 'valid-token' } }
            );

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data).toEqual({ error: 'Failed to fetch request' });
        });
    });

    describe('POST /api/external/share-link/[id]', () => {
        it('should generate valid share link', async () => {
            const mockToken = 'generated-token';
            (externalRequestsRepository.createShareLink as jest.Mock).mockResolvedValue({
                token: mockToken
            });

            const response = await POST(
                new NextRequest(new Request('http://localhost:3000')),
                { params: { id: 'req-123' } }
            );

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({ token: mockToken });
        });

        it('should handle repository errors', async () => {
            (externalRequestsRepository.createShareLink as jest.Mock)
                .mockRejectedValue(new Error('Database error'));

            const response = await POST(
                new NextRequest(new Request('http://localhost:3000')),
                { params: { id: 'req-123' } }
            );

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data).toEqual({ error: 'Failed to generate share link' });
        });
    });
});
