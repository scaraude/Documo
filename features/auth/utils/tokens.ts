import { randomBytes } from 'crypto';

export const generateSecureToken = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

export const generateSessionToken = (): string => {
  return generateSecureToken(64);
};

export const generateVerificationToken = (): string => {
  return generateSecureToken(32);
};

export const isTokenExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

export const getSessionExpiryDate = (): Date => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
  return expiryDate;
};

export const getVerificationExpiryDate = (): Date => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24); // 24 hours
  return expiryDate;
};