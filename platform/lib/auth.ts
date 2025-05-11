import { createHash } from 'crypto';

/**
 * Hashes a password using SHA-256
 * 
 * Note: In a production environment, you should use a more secure
 * hashing algorithm like bcrypt with salt. SHA-256 is used here
 * for simplicity but is not recommended for real-world use.
 */
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

/**
 * Verifies a password against a hash
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === hashedPassword;
} 