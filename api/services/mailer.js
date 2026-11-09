import nodemailer from 'nodemailer';
import { renderOtpEmailHtml, renderSelfNotificationHtml, renderClientConfirmationHtml } from './emailTemplates.js';

/**
 * ==============================================================================
 * MAILER SERVICE (Nodemailer Transporter & Dispatcher)
 * ==============================================================================
 */

/**
 * Returns an initialized Nodemailer transport instance
 * @returns {nodemailer.Transporter}
 */
export function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error('SMTP credentials missing on server. Please configure GMAIL_USER and GMAIL_PASS in .env.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

/**
 * Dispatches a 6-digit OTP email to the sender's email address
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.otp
 * @param {number} [params.expiresInMinutes=10]
 * @returns {Promise<nodemailer.SentMessageInfo>}
 */
export async function sendOtpEmail({ name, email, otp, expiresInMinutes = 10 }) {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Vijay Karthik (Verification)" <${process.env.GMAIL_USER}>`,
    to: email.trim(),
    subject: `🔐 ${otp} is your verification code — Vijay Karthik Portfolio`,
    text: `Hi ${name},\n\nYour 6-digit verification code is: ${otp}\n\nThis code is valid for ${expiresInMinutes} minutes. Enter it on the portfolio contact form to confirm your message.\n\nBest regards,\nVijay Karthik`,
    html: renderOtpEmailHtml({ name, otp, expiresInMinutes })
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Dispatches verified inquiry notification to Vijay Karthik and receipt confirmation to client
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.subject
 * @param {string} params.message
 * @param {string} params.receivedDate
 * @returns {Promise<[nodemailer.SentMessageInfo, nodemailer.SentMessageInfo]>}
 */
export async function sendVerifiedLeadEmails({ name, email, subject, message, receivedDate }) {
  const transporter = getTransporter();

  const textToSelf = `VERIFIED PORTFOLIO LEAD\n====================\nFrom: ${name} <${email}>\nStatus: Email OTP Verified\nSubject: ${subject}\nReceived: ${receivedDate}\n\nMessage:\n${message}\n\n---\nReply directly to: ${email}`;

  const textToSender = `Hi ${name},\n\nThank you for confirming your email and contacting me! I have received your verified message:\n\n"${message}"\n\nI will review it and get back to you as soon as possible.\n\nBest regards,\nRyali Venkata Sri Vijay Karthik\nhttps://vijay-karthik.vercel.app/`;

  const mailToSelf = {
    from: `"Portfolio Contact (Verified)" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `⚡ [Verified Lead] ${subject} — from ${name}`,
    text: textToSelf,
    html: renderSelfNotificationHtml({ name, email, subject, message, receivedDate })
  };

  const mailToSender = {
    from: `"Vijay Karthik" <${process.env.GMAIL_USER}>`,
    to: email,
    replyTo: process.env.GMAIL_USER,
    subject: `Thanks for reaching out, ${name}! — Vijay Karthik`,
    text: textToSender,
    html: renderClientConfirmationHtml({ name, email, subject, message })
  };

  return Promise.all([
    transporter.sendMail(mailToSelf),
    transporter.sendMail(mailToSender),
  ]);
}

