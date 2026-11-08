import nodemailer from 'nodemailer';
import dns from 'dns';

/**
 * ==============================================================================
 * 1. STRICT EMAIL VALIDATION (Format + Disposable Filter + DNS MX Lookup)
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
 * Validates an email address for syntax, length, throwaway providers,
 * and live internet DNS MX (mail exchanger) record existence.
 */
async function validateEmailAddress(email) {
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

/**
 * HTML entities sanitizer to prevent XSS in email bodies
 */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * ==============================================================================
 * 2. POSITIVUS NEO-BRUTALIST HTML EMAIL TEMPLATES
 * ==============================================================================
 */

/**
 * Template 1: High-visibility notification sent to Vijay Karthik
 */
function renderSelfNotificationHtml({ name, email, subject, message, receivedDate }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'Portfolio Inquiry');
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Inquiry</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F3F3F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #191A23;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2.5px solid #191A23; border-radius: 16px; box-shadow: 6px 6px 0px #191A23; overflow: hidden;">
    <!-- Top Positivus Dark Bar -->
    <tr>
      <td style="background-color: #191A23; padding: 24px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="display: inline-block; background-color: #B9FF66; color: #191A23; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; border: 1.5px solid #B9FF66; margin-bottom: 8px;">
                ⚡ NEW PORTFOLIO LEAD
              </span>
              <h1 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 22px; font-weight: 800; line-height: 1.25;">
                Inquiry from ${safeName}
              </h1>
            </td>
            <td align="right" valign="top">
              <div style="width: 40px; height: 40px; background: #B9FF66; border-radius: 8px; border: 2px solid #FFFFFF; text-align: center; line-height: 38px; font-weight: 800; font-size: 15px; color: #191A23;">
                VK
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body Information Box -->
    <tr>
      <td style="padding: 28px;">
        <!-- Sender Meta Table -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #F9F9FB; border: 2px solid #191A23; border-radius: 12px; margin-bottom: 24px; box-shadow: 3px 3px 0px #191A23;">
          <tr>
            <td style="padding: 16px 20px;">
              <table role="presentation" width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td width="90" style="color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">From:</td>
                  <td style="color: #191A23; font-weight: 800; font-size: 15px;">${safeName}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Email:</td>
                  <td>
                    <a href="mailto:${safeEmail}" style="color: #191A23; text-decoration: underline; font-weight: 700;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Subject:</td>
                  <td style="color: #191A23; font-weight: 600;">${safeSubject}</td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Timestamp:</td>
                  <td style="color: #4B5563;">${receivedDate}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Message Box with Signature Lime Border -->
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #191A23; margin-bottom: 8px;">
          Message Content
        </div>
        <div style="background: #FFFFFF; border: 2px solid #191A23; border-left: 6px solid #B9FF66; border-radius: 12px; padding: 22px; font-size: 15px; line-height: 1.6; color: #191A23; margin-bottom: 28px;">
          ${safeMessage}
        </div>

        <!-- Action Button (Neo-brutalist Lime & Black) -->
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius: 999px; background: #B9FF66; border: 2px solid #191A23; box-shadow: 4px 4px 0px #191A23;">
              <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject || 'Your Portfolio Inquiry')}" style="display: inline-block; padding: 13px 26px; color: #191A23; text-decoration: none; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                Reply Directly to ${safeName} &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #F9F9FB; padding: 16px 28px; border-top: 2px solid #191A23; font-size: 12px; color: #6B7280; text-align: center;">
        Automated notification sent from your portfolio backend at <strong>vijay-karthik.vercel.app</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Template 2: Professional confirmation receipt sent to the client / visitor
 */
function renderClientConfirmationHtml({ name, email, subject, message }) {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject || 'Portfolio Inquiry');
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Getting in Touch</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F3F3F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #191A23;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2.5px solid #191A23; border-radius: 16px; box-shadow: 6px 6px 0px #191A23; overflow: hidden;">
    <!-- Lime Positivus Header -->
    <tr>
      <td style="background-color: #B9FF66; padding: 28px; border-bottom: 2.5px solid #191A23;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="display: inline-block; background-color: #191A23; color: #B9FF66; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 10px;">
                MESSAGE CONFIRMATION
              </span>
              <h1 style="margin: 6px 0 0 0; color: #191A23; font-size: 24px; font-weight: 800; line-height: 1.2;">
                Thanks for reaching out, ${safeName}!
              </h1>
            </td>
            <td align="right" valign="top">
              <div style="width: 40px; height: 40px; background: #191A23; border-radius: 8px; border: 2px solid #191A23; text-align: center; line-height: 38px; font-weight: 800; font-size: 15px; color: #B9FF66;">
                VK
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; color: #191A23;">
          Hi <strong>${safeName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          Thank you for contacting me through my portfolio. I’ve successfully received your inquiry and will review it and get back to you shortly (typically within 24 hours).
        </p>

        <!-- Message Summary Box -->
        <div style="background: #F9F9FB; border: 2px solid #191A23; border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 4px 4px 0px #191A23;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 8px;">
            A copy of what you sent:
          </div>
          <div style="font-weight: 800; font-size: 15px; color: #191A23; margin-bottom: 10px;">
            Subject: ${safeSubject}
          </div>
          <div style="font-size: 14px; line-height: 1.6; color: #374151; border-left: 4px solid #B9FF66; padding-left: 14px; margin-top: 8px;">
            &ldquo;${safeMessage}&rdquo;
          </div>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          In the meantime, feel free to check out my latest engineering projects, competitive programming profiles, or connect directly on LinkedIn:
        </p>

        <!-- Profile Links Pills -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="padding-right: 8px; padding-bottom: 8px;">
              <a href="https://vijay-karthik.vercel.app/" style="display: inline-block; background: #191A23; color: #FFFFFF; font-size: 13px; font-weight: 700; text-decoration: none; padding: 9px 18px; border-radius: 999px; border: 1.5px solid #191A23;">
                Portfolio &rarr;
              </a>
            </td>
            <td style="padding-right: 8px; padding-bottom: 8px;">
              <a href="https://github.com/Code-X-Slayer" style="display: inline-block; background: #FFFFFF; color: #191A23; font-size: 13px; font-weight: 700; text-decoration: none; padding: 9px 18px; border-radius: 999px; border: 1.5px solid #191A23;">
                GitHub
              </a>
            </td>
            <td style="padding-right: 8px; padding-bottom: 8px;">
              <a href="https://www.linkedin.com/in/venkata-sri-vijay-karthik-ryali-350895355/" style="display: inline-block; background: #FFFFFF; color: #191A23; font-size: 13px; font-weight: 700; text-decoration: none; padding: 9px 18px; border-radius: 999px; border: 1.5px solid #191A23;">
                LinkedIn
              </a>
            </td>
          </tr>
        </table>

        <!-- Sign-off Block -->
        <div style="border-top: 2px dashed #E5E7EB; padding-top: 20px;">
          <p style="margin: 0 0 4px 0; font-size: 15px; color: #191A23;">Best regards,</p>
          <p style="margin: 0; font-size: 17px; font-weight: 800; color: #191A23;">Ryali Venkata Sri Vijay Karthik</p>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: #6B7280;">B.Tech AI &amp; ML &bull; Aditya University</p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #191A23; padding: 18px 28px; text-align: center; color: #9CA3AF; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Ryali Venkata Sri Vijay Karthik &bull; 
        <a href="mailto:karthikryali2007@gmail.com" style="color: #B9FF66; text-decoration: none; font-weight: 700;">karthikryali2007@gmail.com</a>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * ==============================================================================
 * 3. MAIN API HANDLER
 * ==============================================================================
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  // Check required fields
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill out all required fields (Name, Email, and Message).' });
  }

  // Strict email validation (syntax + disposable domain check + DNS MX record existence)
  const emailValidation = await validateEmailAddress(email);
  if (!emailValidation.valid) {
    return res.status(400).json({
      success: false,
      message: emailValidation.message || 'Invalid email address.'
    });
  }

  // Verify SMTP credentials in environment
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('SMTP Error: GMAIL_USER or GMAIL_PASS missing in environment');
    return res.status(500).json({
      success: false,
      message: 'SMTP credentials missing on server. Please configure GMAIL_USER and GMAIL_PASS in .env.'
    });
  }

  // Initialize Nodemailer SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const receivedDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Plaintext fallbacks for strict text-only email clients
  const textToSelf = `NEW PORTFOLIO INQUIRY\n====================\nFrom: ${name} <${email}>\nSubject: ${subject || 'General Inquiry'}\nReceived: ${receivedDate}\n\nMessage:\n${message}\n\n---\nReply directly to: ${email}`;

  const textToSender = `Hi ${name},\n\nThank you for getting in touch! I have received your message:\n\n"${message}"\n\nI will review it and get back to you as soon as possible.\n\nBest regards,\nRyali Venkata Sri Vijay Karthik\nhttps://vijay-karthik.vercel.app/`;

  // Email 1: Notification sent to Vijay Karthik
  const mailToSelf = {
    from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `⚡ [Portfolio Lead] ${subject || 'New Message'} — from ${name}`,
    text: textToSelf,
    html: renderSelfNotificationHtml({ name, email, subject, message, receivedDate })
  };

  // Email 2: Professional confirmation receipt sent to Client / Sender
  const mailToSender = {
    from: `"Vijay Karthik" <${process.env.GMAIL_USER}>`,
    to: email,
    replyTo: process.env.GMAIL_USER,
    subject: `Thanks for reaching out, ${name}! — Vijay Karthik`,
    text: textToSender,
    html: renderClientConfirmationHtml({ name, email, subject, message })
  };

  try {
    // Send both emails in parallel via SMTP
    const [info1, info2] = await Promise.all([
      transporter.sendMail(mailToSelf),
      transporter.sendMail(mailToSender),
    ]);

    console.log('✓ Notification email sent to admin:', info1.messageId);
    console.log('✓ Confirmation email sent to client:', info2.messageId);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! A confirmation receipt has been emailed to you.'
    });
  } catch (error) {
    console.error('SMTP sending error:', error);
    const errorDetails = error && error.message ? error.message : 'SMTP delivery failed';
    return res.status(500).json({
      success: false,
      message: `Failed to send email via SMTP: ${errorDetails}. Please ensure your GMAIL_PASS is a 16-character Google App Password.`
    });
  }
}
