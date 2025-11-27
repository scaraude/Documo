import { describe, expect, it } from 'vitest';
import {
  generatePasswordResetToken,
  generateSecureToken,
  generateSessionToken,
  generateVerificationToken,
  getPasswordResetExpiryDate,
  getSessionExpiryDate,
  getVerificationExpiryDate,
  isTokenExpired,
} from '../utils/tokens';

describe('Token Utils', () => {
  describe('generateSecureToken', () => {
    it('should generate token with default length', () => {
      const token = generateSecureToken();

      expect(token).toHaveLength(64); // 32 bytes * 2 (hex)
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate token with custom length', () => {
      const token = generateSecureToken(16);

      expect(token).toHaveLength(32); // 16 bytes * 2 (hex)
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateSessionToken', () => {
    it('should generate session token with correct length', () => {
      const token = generateSessionToken();

      expect(token).toHaveLength(128); // 64 bytes * 2 (hex)
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate unique session tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateVerificationToken', () => {
    it('should generate verification token with correct length', () => {
      const token = generateVerificationToken();

      expect(token).toHaveLength(64); // 32 bytes * 2 (hex)
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate unique verification tokens', () => {
      const token1 = generateVerificationToken();
      const token2 = generateVerificationToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate password reset token with correct length', () => {
      const token = generatePasswordResetToken();

      expect(token).toHaveLength(64); // 32 bytes * 2 (hex)
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate unique password reset tokens', () => {
      const token1 = generatePasswordResetToken();
      const token2 = generatePasswordResetToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for future date', () => {
      const futureDate = new Date(Date.now() + 60000); // 1 minute from now

      expect(isTokenExpired(futureDate)).toBe(false);
    });

    it('should return true for past date', () => {
      const pastDate = new Date(Date.now() - 60000); // 1 minute ago

      expect(isTokenExpired(pastDate)).toBe(true);
    });

    it('should return true for current time', () => {
      const now = new Date();

      // Small delay to ensure current time has passed
      setTimeout(() => {
        expect(isTokenExpired(now)).toBe(true);
      }, 1);
    });
  });

  describe('getSessionExpiryDate', () => {
    it('should return date 7 days from now', () => {
      const expiryDate = getSessionExpiryDate();
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 7);

      // Allow for small time differences (within 1 second)
      const timeDiff = Math.abs(expiryDate.getTime() - expectedDate.getTime());
      expect(timeDiff).toBeLessThan(1000);
    });

    it('should return future date', () => {
      const expiryDate = getSessionExpiryDate();
      const now = new Date();

      expect(expiryDate.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('getVerificationExpiryDate', () => {
    it('should return date 24 hours from now', () => {
      const expiryDate = getVerificationExpiryDate();
      const expectedDate = new Date();
      expectedDate.setHours(expectedDate.getHours() + 24);

      // Allow for small time differences (within 1 second)
      const timeDiff = Math.abs(expiryDate.getTime() - expectedDate.getTime());
      expect(timeDiff).toBeLessThan(1000);
    });

    it('should return future date', () => {
      const expiryDate = getVerificationExpiryDate();
      const now = new Date();

      expect(expiryDate.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('getPasswordResetExpiryDate', () => {
    it('should return date 1 hour from now', () => {
      const expiryDate = getPasswordResetExpiryDate();
      const expectedDate = new Date();
      expectedDate.setHours(expectedDate.getHours() + 1);

      // Allow for small time differences (within 1 second)
      const timeDiff = Math.abs(expiryDate.getTime() - expectedDate.getTime());
      expect(timeDiff).toBeLessThan(1000);
    });

    it('should return future date', () => {
      const expiryDate = getPasswordResetExpiryDate();
      const now = new Date();

      expect(expiryDate.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should have shorter expiry than session tokens', () => {
      const sessionExpiry = getSessionExpiryDate();
      const resetExpiry = getPasswordResetExpiryDate();

      expect(resetExpiry.getTime()).toBeLessThan(sessionExpiry.getTime());
    });
  });
});
