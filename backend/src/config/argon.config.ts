import * as argon2 from 'argon2';
import * as crypto from 'crypto';

export const argonConfig = {
  type: argon2.argon2id,
  version: 19,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
  salt: crypto.randomBytes(16),
  hashLength: 64, // in bytes
};
