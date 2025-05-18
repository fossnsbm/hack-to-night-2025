import * as argon2 from 'argon2';

/**
 * Hashes a password using argon2id
 * 
 * @param password - The password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    
    memoryCost: 65536, 
    timeCost: 3, 
    parallelism: 1, 
  });
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
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
} 