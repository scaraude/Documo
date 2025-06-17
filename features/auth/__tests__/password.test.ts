import { hashPassword, verifyPassword } from '../utils/password';

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'SecurePass123!';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const emptyPassword = '';
      const hashedPassword = await hashPassword(emptyPassword);

      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('should handle special characters in password', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hashedPassword = await hashPassword(specialPassword);

      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'CorrectPassword123!';
      const hashedPassword = await hashPassword(password);

      const isValid = await verifyPassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const correctPassword = 'CorrectPassword123!';
      const incorrectPassword = 'WrongPassword123!';
      const hashedPassword = await hashPassword(correctPassword);

      const isValid = await verifyPassword(incorrectPassword, hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should reject empty password against hash', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);

      const isValid = await verifyPassword('', hashedPassword);

      expect(isValid).toBe(false);
    });

    it('should handle invalid hash format', async () => {
      const password = 'TestPassword123!';
      const invalidHash = 'invalid-hash-format';

      const result = await verifyPassword(password, invalidHash);
      expect(result).toBe(false);
    });

    it('should be case sensitive', async () => {
      const password = 'CaseSensitive123!';
      const hashedPassword = await hashPassword(password);

      const isValidLower = await verifyPassword('casesensitive123!', hashedPassword);
      const isValidUpper = await verifyPassword('CASESENSITIVE123!', hashedPassword);

      expect(isValidLower).toBe(false);
      expect(isValidUpper).toBe(false);
    });
  });
});