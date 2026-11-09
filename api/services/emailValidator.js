import dns from 'dns';

/**
 * ==============================================================================
 * STRICT EMAIL VALIDATION SERVICE (Syntax + Disposable Blocklist + DNS MX)
 * ==============================================================================
 */

// RFC 5322 compliant regex for syntax checking
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Common disposable / throwaway email service domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'yopmail.com', 'trashmail.com', 'getairmail.com', 'fakeinbox.com',
  'throwawaymail.com', 'dispostable.com', 'sharklasers.com', 'generator.email',
  'inboxkitten.com', 'mytemp.email', 'temp-mail.org', 'dropmail.me',
  'tempail.com', 'mohmal.com', 'crazymailing.com', 'disposablemail.com'
]);

/**
 * Validates an email address for:
 * 1. Required presence and string type
 * 2. Maximum length (RFC 254 characters)
 * 3. Strict RFC 5322 regex syntax
 * 4. Disposable/throwaway domain blocklist
 * 5. Live DNS MX (mail exchange) resolution
 *
 * @param {string} email
 * @returns {Promise<{ valid: boolean, message?: string }>}
 */
export async function validateEmailAddress(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email address is required.' };
  }

  const trimmed = email.trim();
  if (trimmed.length > 254) {
    return { valid: false, message: 'Email address is too long (maximum 254 characters).' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Please provide a valid email address (e.g., name@example.com).' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { valid: false, message: 'Invalid email structure.' };
  }

  const [localPart, domain] = parts;
  if (localPart.length > 64) {
    return { valid: false, message: 'Email username is too long.' };
  }

  const lowerDomain = domain.toLowerCase();

  // Check for disposable domains
  if (DISPOSABLE_DOMAINS.has(lowerDomain)) {
    return {
      valid: false,
      message: 'Temporary or disposable email domains are not allowed. Please use a valid email.'
    };
  }

  // Check if domain actually exists on the internet and has mail servers (MX records)
  try {
    const mxRecords = await dns.promises.resolveMx(lowerDomain);
    if (!mxRecords || mxRecords.length === 0) {
      // Fallback check for root A records (rare fallback mail destination)
      try {
        const aRecords = await dns.promises.resolve4(lowerDomain);
        if (!aRecords || aRecords.length === 0) {
          return {
            valid: false,
            message: `The domain "@${domain}" cannot receive email (no mail exchange records found).`
          };
        }
      } catch (aErr) {
        return {
          valid: false,
          message: `The domain "@${domain}" cannot receive email (no mail exchange records found).`
        };
      }
    }
  } catch (dnsErr) {
    if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA' || dnsErr.code === 'EREFUSED') {
      return {
        valid: false,
        message: `The domain "@${domain}" does not exist on the internet. Please check your spelling.`
      };
    }
    // For DNS lookup timeouts, log and allow through to prevent false negatives on slow networks
    console.warn(`DNS lookup non-critical warning for domain ${lowerDomain}:`, dnsErr.code || dnsErr.message);
  }

  return { valid: true };
}

