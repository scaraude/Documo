import * as externalRequestsRepository from '../../repository/externalRequestsRepository'
import prisma from '@/lib/prisma'
import { randomUUID } from 'crypto'

describe('ExternalRequestsRepository Integration Tests', () => {
  let testRequestId: string
  let testShareLinkToken: string
  let testCivilId: string
  let testRequestedDocuments: string[]

  beforeEach(async () => {
    // Get a test request and share link from seeded data
    const testRequest = await prisma.documentRequest.findFirst()
    const testShareLink = await prisma.requestShareLink.findFirst()
    
    if (!testRequest || !testShareLink) {
      throw new Error('No test request or share link found in seeded data')
    }
    
    testRequestId = testRequest.id
    testShareLinkToken = testShareLink.token
    testCivilId = testRequest.civilId
    testRequestedDocuments = testRequest.requestedDocuments
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
      // Act - Use actual seeded token
      const foundShareLink = await externalRequestsRepository.getShareLinkByToken(testShareLinkToken)

      // Assert
      expect(foundShareLink).toBeTruthy()
      expect(foundShareLink?.token).toBe(testShareLinkToken)
      expect(foundShareLink?.request).toBeTruthy()
      expect(foundShareLink?.request?.civilId).toBe(testCivilId)
      expect(foundShareLink?.expiresAt.getTime()).toBeGreaterThan(Date.now())
    })

    it('should return null for non-existent token', async () => {
      // Act
      const result = await externalRequestsRepository.getShareLinkByToken('non-existent-token')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null for expired token', async () => {
      // Arrange - Create an expired token
      const expiredToken = randomUUID()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      await prisma.requestShareLink.create({
        data: {
          requestId: testRequestId,
          token: expiredToken,
          expiresAt: yesterday
        }
      })

      // Act
      const result = await externalRequestsRepository.getShareLinkByToken(expiredToken)

      // Assert - Should be null because token is expired
      expect(result).toBeNull()
    })

    it('should include request details in response', async () => {
      // Act
      const shareLink = await externalRequestsRepository.getShareLinkByToken(testShareLinkToken)

      // Assert
      expect(shareLink?.request).toMatchObject({
        civilId: testCivilId,
        requestedDocuments: testRequestedDocuments
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

      // Verify seeded valid link still exists
      const seededValidLink = await externalRequestsRepository.getShareLinkByToken(testShareLinkToken)
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
    it('should work with seeded request data', async () => {
      // Act
      const shareLink = await externalRequestsRepository.getShareLinkByToken(testShareLinkToken)

      // Assert
      expect(shareLink).toBeTruthy()
      expect(shareLink?.request?.civilId).toBe(testCivilId)
      expect(shareLink?.request?.createdAt).toBeInstanceOf(Date)
    })

    it('should handle requests with document types', async () => {
      // Act
      const shareLink = await externalRequestsRepository.getShareLinkByToken(testShareLinkToken)

      // Assert
      expect(shareLink?.request?.requestedDocuments).toEqual(testRequestedDocuments)
      expect(Array.isArray(shareLink?.request?.requestedDocuments)).toBe(true)
    })
  })
})