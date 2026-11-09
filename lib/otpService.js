import crypto from 'crypto';

/**
 * ==============================================================================
 * OTP SECURITY & CRYPTOGRAPHIC TOKEN SERVICE
 * ==============================================================================
 * Features:
 * - HMAC-SHA256 stateless tamper-proof tokens containing verification state.
 * - In-memory replay prevention (used token IDs).
 * - Per-email 60-second anti-abuse cooldown tracking.
 * - Per-token 5-attempt limit tracking with automatic session lockout.
 * - Constant-time SHA256 OTP verification against timing attacks.
 * ==============================================================================
 */

// In-memory trackers for security & anti-abuse
const attemptsStore = new Map(); // tokenId -> { attempts, lastAttemptAt }
const usedTokens = new Set();    // Set of consumed token IDs (replay attack prevention)
const cooldownStore = new Map();  // email -> timestamp of last OTP sent

// Periodic cleanup of expired entries (every 15 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of attemptsStore.entries()) {
    if (now - data.lastAttemptAt > 15 * 60 * 1000) {
      attemptsStore.delete(id);
    }
  }
  for (const [email, ts] of cooldownStore.entries()) {
    if (now - ts > 15 * 60 * 1000) {
      cooldownStore.delete(email);
    }
  }
  // Cap usedTokens set size
  if (usedTokens.size > 5000) {
    usedTokens.clear();
  }
}, 15 * 60 * 1000).unref();

function getSecretKey() {
  return process.env.OTP_SECRET || process.env.GMAIL_PASS || 'portfolio_otp_secret_aditya_2026';
}

/**
 * Computes a salted SHA256 hash of an OTP
 * @param {string} otp
 * @param {string} salt
 * @returns {string} hex hash
 */
export function hashOtp(otp, salt) {
  return crypto.createHash('sha256').update(String(otp) + salt).digest('hex');
}

/**
 * Creates an HMAC-signed base64url verification token
 * @param {object} payload
 * @returns {string}
 */
export function createVerificationToken(payload) {
  const secret = getSecretKey();
  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(dataStr).digest('base64url');
  return `${dataStr}.${signature}`;
}

/**
 * Verifies the HMAC signature and decodes the payload
 * @param {string} token
 * @returns {object|null} payload if valid, null if invalid or tampered
 */
export function verifyVerificationToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [dataStr, signature] = parts;
  const secret = getSecretKey();
  const expectedSig = crypto.createHmac('sha256', secret).update(dataStr).digest('base64url');

  if (signature !== expectedSig) {
    return null; // Signature mismatch / tampering
  }

  try {
    const payload = JSON.parse(Buffer.from(dataStr, 'base64url').toString('utf8'));
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Generates a random 6-digit numeric OTP string
 * @returns {string}
 */
export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Generates a random cryptographic hex salt
 * @returns {string}
 */
export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Generates a unique UUID v4 identifier
 * @returns {string}
 */
export function generateTokenId() {
  return crypto.randomUUID();
}

/**
 * Checks if the email is currently in cooldown (within 60 seconds)
 * @param {string} email
 * @returns {{ inCooldown: boolean, waitSec?: number }}
 */
export function checkCooldown(email) {
  const lower = email.trim().toLowerCase();
  const lastSent = cooldownStore.get(lower);
  if (lastSent && Date.now() - lastSent < 60000) {
    const waitSec = Math.ceil((60000 - (Date.now() - lastSent)) / 1000);
    return { inCooldown: true, waitSec };
  }
  return { inCooldown: false, waitSec: 0 };
}

/**
 * Updates cooldown timestamp for an email
 * @param {string} email
 */
export function setCooldown(email) {
  const lower = email.trim().toLowerCase();
  cooldownStore.set(lower, Date.now());
}

/**
 * Checks if a token ID was already consumed (replay attack prevention)
 * @param {string} tokenId
 * @returns {boolean}
 */
export function isTokenUsed(tokenId) {
  return usedTokens.has(tokenId);
}

/**
 * Marks a token ID as consumed
 * @param {string} tokenId
 */
export function markTokenUsed(tokenId) {
  usedTokens.add(tokenId);
}

/**
 * Retrieves the current attempt count for a token session
 * @param {string} tokenId
 * @returns {number}
 */
export function getAttemptCount(tokenId) {
  const session = attemptsStore.get(tokenId);
  return session ? session.attempts : 0;
}

/**
 * Records a failed attempt for a token session and returns remaining attempts
 * @param {string} tokenId
 * @param {number} maxAttempts
 * @returns {number} remaining attempts
 */
export function recordFailedAttempt(tokenId, maxAttempts = 5) {
  const session = attemptsStore.get(tokenId) || { attempts: 0, lastAttemptAt: Date.now() };
  session.attempts += 1;
  session.lastAttemptAt = Date.now();
  attemptsStore.set(tokenId, session);
  return Math.max(0, maxAttempts - session.attempts);
}

/**
 * Clears attempt tracking for a completed token session
 * @param {string} tokenId
 */
export function clearAttempts(tokenId) {
  attemptsStore.delete(tokenId);
}

/**
 * Constant-time OTP comparison against timing attacks
 * @param {string} enteredOtp
 * @param {string} salt
 * @param {string} expectedHash
 * @returns {boolean}
 */
export function verifyOtpHash(enteredOtp, salt, expectedHash) {
  const testHash = hashOtp(String(enteredOtp).trim(), salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(expectedHash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch (err) {
    return false;
  }
}

