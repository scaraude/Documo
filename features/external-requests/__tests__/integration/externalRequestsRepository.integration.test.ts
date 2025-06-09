import * as externalRequestsRepository from '../../repository/externalRequestsRepository'
import * as requestRepository from '../../../requests/repository/requestRepository'
import { APP_DOCUMENT_TYPES } from '@/shared/constants'
import { randomUUID } from 'crypto'

describe('ExternalRequestsRepository Integration Tests', () => {
  describe('createShareLink', () => {
    it('should create a share link for a request', async () => {
      // Arrange - First create a document request
      const request = await requestRepository.createRequest({
        civilId: 'test-civil-123',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      })

      const token = randomUUID()
      const expiresAt = new Date(Date.now() + 86400000) // 24 hours from now

      // Act
      const shareLink = await externalRequestsRepository.createShareLink({
        requestId: request.id,
        token,
        expiresAt,
      })

      // Assert
      expect(shareLink).toMatchObject({
        requestId: request.id,
        token,
        expiresAt,
      })
      expect(shareLink.id).toBeDefined()
      expect(shareLink.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('getShareLinkByToken', () => {
    it('should find share link by valid token', async () => {
      // Arrange
      const request = await requestRepository.createRequest({
        civilId: 'test-civil-789',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      })
      
      const token = randomUUID()
      const expiresAt = new Date(Date.now() + 86400000) // 24 hours from now
      
      await externalRequestsRepository.createShareLink({
        requestId: request.id,
        token,
        expiresAt,
      })

      // Act
      const foundShareLink = await externalRequestsRepository.getShareLinkByToken(token)

      // Assert
      expect(foundShareLink).toBeTruthy()
      expect(foundShareLink?.token).toBe(token)
      expect(foundShareLink?.requestId).toBe(request.id)
      expect(foundShareLink?.request).toBeTruthy()
      expect(foundShareLink?.request?.civilId).toBe('test-civil-789')
    })

    it('should return null for non-existent token', async () => {
      // Act
      const result = await externalRequestsRepository.getShareLinkByToken('non-existent-token')

      // Assert
      expect(result).toBeNull()
    })

    it('should return null for expired token', async () => {
      // Arrange - Create an expired share link
      const request = await requestRepository.createRequest({
        civilId: 'test-civil-expired',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      })
      
      const expiredToken = randomUUID()
      const expiredDate = new Date(Date.now() - 86400000) // 24 hours ago
      
      await externalRequestsRepository.createShareLink({
        requestId: request.id,
        token: expiredToken,
        expiresAt: expiredDate,
      })

      // Act
      const result = await externalRequestsRepository.getShareLinkByToken(expiredToken)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('deleteExpiredShareLinks', () => {
    it('should delete expired share links', async () => {
      // Arrange - Create both expired and valid share links
      const request1 = await requestRepository.createRequest({
        civilId: 'test-civil-expired-1',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      })
      
      const request2 = await requestRepository.createRequest({
        civilId: 'test-civil-valid',
        requestedDocuments: [APP_DOCUMENT_TYPES.IDENTITY_CARD],
      })

      const expiredToken = randomUUID()
      const validToken = randomUUID()
      
      // Create expired share link
      await externalRequestsRepository.createShareLink({
        requestId: request1.id,
        token: expiredToken,
        expiresAt: new Date(Date.now() - 86400000), // 24 hours ago
      })
      
      // Create valid share link
      await externalRequestsRepository.createShareLink({
        requestId: request2.id,
        token: validToken,
        expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      })

      // Act
      const deleteResult = await externalRequestsRepository.deleteExpiredShareLinks()

      // Assert
      expect(deleteResult.count).toBeGreaterThan(0)
      
      // Verify expired link is gone
      const expiredLinkResult = await externalRequestsRepository.getShareLinkByToken(expiredToken)
      expect(expiredLinkResult).toBeNull()
      
      // Verify valid link still exists
      const validLinkResult = await externalRequestsRepository.getShareLinkByToken(validToken)
      expect(validLinkResult).toBeTruthy()
    })
  })
})