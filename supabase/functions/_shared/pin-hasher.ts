import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

/**
 * Hash a PIN using bcrypt
 * Uses bcrypt for secure hashing with salt
 */
export async function hashPin(pin: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pin, salt);
}

/**
 * Verify a PIN against a bcrypt hash
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(pin, hash);
}
