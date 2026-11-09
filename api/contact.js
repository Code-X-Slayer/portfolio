import { validateEmailAddress } from '../lib/emailValidator.js';
import {
  hashOtp,
  createVerificationToken,
  verifyVerificationToken,
  generateOtp,
  generateSalt,
  generateTokenId,
  checkCooldown,
  setCooldown,
  isTokenUsed,
  markTokenUsed,
  getAttemptCount,
  recordFailedAttempt,
  clearAttempts,
  verifyOtpHash
} from '../lib/otpService.js';
import { sendOtpEmail, sendVerifiedLeadEmails } from '../lib/mailer.js';

/**
 * ==============================================================================
 * CONTACT API CONTROLLER (Serverless / Express compatible)
 * ==============================================================================
 * Routes & Actions:
 * - action === 'send_otp'   -> Validates email format/MX, creates token & sends OTP
 * - action === 'verify_otp' -> Verifies HMAC token & 6-digit OTP, dispatches inquiry
 * - action === 'resend_otp' -> Enforces 60s cooldown, issues fresh OTP token
 * ==============================================================================
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Ensure SMTP credentials exist
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('SMTP Error: GMAIL_USER or GMAIL_PASS missing in environment');
    return res.status(500).json({
      success: false,
      message: 'SMTP credentials missing on server. Please configure GMAIL_USER and GMAIL_PASS in .env.'
    });
  }

  const body = req.body || {};
  const action = body.action || 'send_otp';

  // --------------------------------------------------------------------------
  // STEP 1: INITIAL SUBMISSION -> VALIDATE EMAIL & DISPATCH OTP
  // --------------------------------------------------------------------------
  if (action === 'send_otp') {
    const { name, email, subject, message } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const emailValidation = await validateEmailAddress(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.message || 'Invalid email address.'
      });
    }

    const lowerEmail = email.trim().toLowerCase();
    const cooldownCheck = checkCooldown(lowerEmail);
    if (cooldownCheck.inCooldown) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${cooldownCheck.waitSec} seconds before requesting another verification code.`
      });
    }

    // Generate secure 6-digit OTP and HMAC signed token payload
    const otp = generateOtp();
    const salt = generateSalt();
    const otpHash = hashOtp(otp, salt);
    const tokenId = generateTokenId();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    setCooldown(lowerEmail);

    const tokenPayload = {
      id: tokenId,
      email: email.trim(),
      name: name.trim(),
      subject: (subject || 'Portfolio Inquiry').trim(),
      message: message.trim(),
      otpHash,
      salt,
      expiresAt,
      lastSentAt: Date.now()
    };

    const verificationToken = createVerificationToken(tokenPayload);

    try {
      await sendOtpEmail({ name: name.trim(), email: email.trim(), otp, expiresInMinutes: 10 });
      console.log(`✓ OTP sent to ${email.trim()} for inquiry verification`);

      return res.status(200).json({
        success: true,
        step: 'otp_required',
        verificationToken,
        email: email.trim(),
        message: `A 6-digit verification code has been sent to ${email.trim()}.`
      });
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr);
      return res.status(500).json({
        success: false,
        message: `Failed to deliver verification code: ${mailErr.message || 'SMTP error'}. Please check that your email address exists and can receive mail.`
      });
    }
  }

  // --------------------------------------------------------------------------
  // STEP 2: VERIFY OTP & DELIVER INQUIRY
  // --------------------------------------------------------------------------
  if (action === 'verify_otp' || action === 'verify') {
    const { verificationToken, otp } = body;

    if (!verificationToken || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Verification token and OTP code are required.'
      });
    }

    const payload = verifyVerificationToken(verificationToken);
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid, tampered, or corrupted verification session. Please submit the form again.'
      });
    }

    const { id, email, name, subject, message, otpHash, salt, expiresAt } = payload;

    if (isTokenUsed(id)) {
      return res.status(400).json({
        success: false,
        message: 'This verification code has already been used and submitted. Please do not submit duplicate requests.'
      });
    }

    if (Date.now() > expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'The verification code has expired (valid for 10 minutes). Please request a new code.'
      });
    }

    if (getAttemptCount(id) >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts (maximum 5). This session has been locked for security. Please edit and submit again.'
      });
    }

    const isMatch = verifyOtpHash(otp, salt, otpHash);
    if (!isMatch) {
      const remaining = recordFailedAttempt(id, 5);
      return res.status(400).json({
        success: false,
        message: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      });
    }

    // Mark as consumed & clear attempts
    markTokenUsed(id);
    clearAttempts(id);

    const receivedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    try {
      const [info1, info2] = await sendVerifiedLeadEmails({
        name,
        email,
        subject,
        message,
        receivedDate
      });

      console.log('✓ Verified lead delivered to admin:', info1.messageId);
      console.log('✓ Confirmation delivered to client:', info2.messageId);

      return res.status(200).json({
        success: true,
        step: 'verified',
        message: '✓ Email verified successfully! Your message has been delivered to Vijay Karthik.'
      });
    } catch (deliverErr) {
      console.error('Error delivering verified messages:', deliverErr);
      return res.status(500).json({
        success: false,
        message: `Email verified, but message delivery encountered an issue: ${deliverErr.message || 'SMTP error'}. Please try again.`
      });
    }
  }

  // --------------------------------------------------------------------------
  // STEP 3: RESEND OTP
  // --------------------------------------------------------------------------
  if (action === 'resend_otp' || action === 'resend') {
    const { verificationToken } = body;

    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required to resend code.'
      });
    }

    const payload = verifyVerificationToken(verificationToken);
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session. Please submit the form again.'
      });
    }

    const { id, email, name, lastSentAt } = payload;
    const now = Date.now();
    if (now - lastSentAt < 60000) {
      const waitSec = Math.ceil((60000 - (now - lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new code.`
      });
    }

    const newOtp = generateOtp();
    const newSalt = generateSalt();
    const newOtpHash = hashOtp(newOtp, newSalt);
    const newTokenId = generateTokenId();
    const newExpiresAt = now + 10 * 60 * 1000;

    markTokenUsed(id); // invalidate old token ID

    const newPayload = {
      ...payload,
      id: newTokenId,
      otpHash: newOtpHash,
      salt: newSalt,
      expiresAt: newExpiresAt,
      lastSentAt: now
    };

    const newVerificationToken = createVerificationToken(newPayload);
    setCooldown(email);

    try {
      await sendOtpEmail({ name, email, otp: newOtp, expiresInMinutes: 10 });
      console.log(`✓ Resent fresh OTP to ${email}`);

      return res.status(200).json({
        success: true,
        step: 'otp_required',
        verificationToken: newVerificationToken,
        email,
        message: `A fresh 6-digit verification code has been sent to ${email}.`
      });
    } catch (mailErr) {
      console.error('Failed to resend OTP email:', mailErr);
      return res.status(500).json({
        success: false,
        message: `Failed to deliver verification code: ${mailErr.message || 'SMTP error'}.`
      });
    }
  }

  return res.status(400).json({
    success: false,
    message: `Unknown action "${action}". Valid actions are send_otp, verify_otp, resend_otp.`
  });
}
