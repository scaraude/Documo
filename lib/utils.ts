import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const randomBytesAsync = promisify(randomBytes);

/**
 * Generate a cryptographically secure token for share links
 */
export async function generateSecureToken(): Promise<string> {
  const bytes = await randomBytesAsync(32);
  return bytes.toString('base64url');
}
