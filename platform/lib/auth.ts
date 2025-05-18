import * as bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt
 * 
 * @param password - The password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12); // 12 rounds is a good balance between security and speed
  return await bcrypt.hash(password, salt);
}

/**
 * Verifies a password against a hash
 * 
 * @param password - The password to verify
 * @param hashedPassword - The hashed password to verify against
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
} 