const crypto = require('crypto');

// Generate a random 256-bit (32-byte) key
const key = crypto.randomBytes(32).toString('hex');
console.log(`Generated Encryption Key: ${key}`);
