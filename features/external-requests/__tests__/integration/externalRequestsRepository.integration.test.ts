import * as externalRequestsRepository from '../../repository/externalRequestsRepository'
import prisma from '@/lib/prisma'
import { randomUUID } from 'crypto'

describe('ExternalRequestsRepository Integration Tests', () => {
  let testRequestId: string

  beforeEach(async () => {
    // Get a test request from seeded data
    const testRequest = await prisma.documentRequest.findFirst({
      where: {
        civilId: 'test-civil-valid@example.com'
      }
    })
    testRequestId = testRequest!.id
  })

  describe('createShareLink', () => {
    it('should create a share link for a request', async () => {
      // Arrange
      const token = randomUUID()
      const expiresAt = new Date(Date.now() + 86400000) // 24 hours from now

      // Act
      const shareLink = await externalRequestsRepository.createShareLink({
        requestId: testRequestId,
        token,
        expiresAt,
      })

      // Assert
      expect(shareLink).toMatchObject({
        requestId: testRequestId,
        token,
        expiresAt,
      })
      expect(shareLink.id).toBeDefined()
      expect(shareLink.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('getShareLinkByToken', () => {
    it('should find share link by valid token using seeded data', async () => {
      // Act - Use pre-seeded valid token
      const foundShareLink = await externalRequestsRepository.getShareLinkByToken('test-valid-token-123')

      // Assert
      expect(foundShareLink).toBeTruthy()
      expect(foundShareLink?.token).toBe('test-valid-token-123')
      expect(foundShareLink?.request).toBeTruthy()
      expect(foundShareLink?.request?.civilId).toBe('test-civil-valid@example.com')
      expect(foundShareLink?.expiresAt.getTime()).toBeGreaterThan(Date.now())
    })

    it('should return null for non-existent token', async () => {
      // Act
      const result = await externalRequestsRepository.getShareLinkByToken('non-existent-token')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null for expired token using seeded data', async () => {
      // Act - Use pre-seeded expired token
      const result = await externalRequestsRepository.getShareLinkByToken('test-expired-token-456')

      // Assert - Should be null because token is expired (expiresAt is in the past)
      expect(result).toBeNull()
    })

    it('should include request details in response', async () => {
      // Act
      const shareLink = await externalRequestsRepository.getShareLinkByToken('test-valid-token-123')

      // Assert
      expect(shareLink?.request).toMatchObject({
        civilId: 'test-civil-valid@example.com',
        requestedDocuments: expect.arrayContaining(['IDENTITY_CARD', 'BANK_STATEMENT'])
      })
      expect(shareLink?.request?.expiresAt).toBeInstanceOf(Date)
      expect(shareLink?.request?.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('deleteExpiredShareLinks', () => {
    it('should delete expired share links but keep valid ones', async () => {
      // Arrange - Create additional test data
      const newValidToken = randomUUID()
      const newExpiredToken = randomUUID()

      // Create a new valid share link
      await externalRequestsRepository.createShareLink({
        requestId: testRequestId,
        token: newValidToken,
        expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      })

      // Create a new expired share link
      await externalRequestsRepository.createShareLink({
        requestId: testRequestId,
        token: newExpiredToken,
        expiresAt: new Date(Date.now() - 86400000), // 24 hours ago
      })

      // Count expired links before deletion
      const expiredLinksBefore = await prisma.requestShareLink.count({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      // Act
      const deleteResult = await externalRequestsRepository.deleteExpiredShareLinks()

      // Assert
      expect(deleteResult.count).toBe(expiredLinksBefore)
      expect(deleteResult.count).toBeGreaterThan(0)

      // Verify our newly created expired link is gone
      const expiredLinkResult = await externalRequestsRepository.getShareLinkByToken(newExpiredToken)
      expect(expiredLinkResult).toBeNull()

      // Verify our newly created valid link still exists
      const validLinkResult = await externalRequestsRepository.getShareLinkByToken(newValidToken)
      expect(validLinkResult).toBeTruthy()

      // Verify pre-seeded valid link still exists
      const seededValidLink = await externalRequestsRepository.getShareLinkByToken('test-valid-token-123')
      expect(seededValidLink).toBeTruthy()
    })

    it('should return zero count when no expired links exist', async () => {
      // Arrange - First delete all expired links
      await externalRequestsRepository.deleteExpiredShareLinks()

      // Act - Try to delete expired links again
      const deleteResult = await externalRequestsRepository.deleteExpiredShareLinks()

      // Assert
      expect(deleteResult.count).toBe(0)
    })
  })

  describe('integration with seeded data', () => {
    it('should work with completed request data', async () => {
      // Act - Get share link for completed request
      const completedShareLink = await externalRequestsRepository.getShareLinkByToken('test-completed-token-789')

      // Assert
      expect(completedShareLink).toBeTruthy()
      expect(completedShareLink?.request?.civilId).toBe('test-civil-completed@example.com')
      expect(completedShareLink?.request?.completedAt).toBeInstanceOf(Date)
    })

    it('should handle requests with different document types', async () => {
      // Act
      const shareLink = await externalRequestsRepository.getShareLinkByToken('test-valid-token-123')

      // Assert
      expect(shareLink?.request?.requestedDocuments).toEqual(
        expect.arrayContaining(['IDENTITY_CARD', 'BANK_STATEMENT'])
      )
    })
  })
})