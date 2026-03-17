import * as crypto from 'crypto'; // Use import * as if your tsconfig requires it

/**
 * Generates a cryptographically secure random string.
 * @param length The desired length of the string.
 * @returns A random hexadecimal string.
 */
function generateSecureRandomString(length: number): string {
    // Generate enough bytes to cover the desired length in hexadecimal representation.
    // A single byte converts to two hexadecimal characters.
    const bytesNeeded = Math.ceil(length / 2);
    
    // Generate random bytes and convert them to a hex string.
    const randomBytes = crypto.randomBytes(bytesNeeded).toString('hex');
    
    // Slice the string to the exact requested length.
    return randomBytes.slice(0, length);
}

// Usage
const token = generateSecureRandomString(32);
console.log(token); // Example: 'a1b2c3d4e5f6...'