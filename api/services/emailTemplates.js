/**
 * ==============================================================================
 * POSITIVUS NEO-BRUTALIST HTML EMAIL TEMPLATES
 * ==============================================================================
 * Styling matches the portfolio design language:
 * - High-contrast palette: #191A23 (Dark slate), #B9FF66 (Neon lime), #FFFFFF
 * - Neo-brutalist rounded cards with solid borders and sharp offset shadows
 * - Responsive table layouts supported across Gmail, Outlook, Apple Mail
 * ==============================================================================
 */

/**
 * Sanitizes input strings to prevent HTML injection and XSS in email clients
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Template 0: OTP Verification Email sent to the user to confirm mailbox existence
 */
export function renderOtpEmailHtml({ name, otp, expiresInMinutes = 10 }) {
  const safeName = escapeHtml(name);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F3F3F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #191A23;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 2.5px solid #191A23; border-radius: 16px; box-shadow: 6px 6px 0px #191A23; overflow: hidden;">
    <!-- Top Bar -->
    <tr>
      <td style="background-color: #191A23; padding: 24px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="display: inline-block; background-color: #B9FF66; color: #191A23; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; border: 1.5px solid #B9FF66; margin-bottom: 8px;">
                SECURITY VERIFICATION
              </span>
              <h1 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 22px; font-weight: 800; line-height: 1.25;">
                Verify Your Email Address
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

    <!-- Body -->
    <tr>
      <td style="padding: 28px;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 14px; color: #191A23;">
          Hi <strong>${safeName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 22px; color: #374151;">
          Please enter the following 6-digit one-time verification code on the portfolio contact form to confirm your message to Vijay Karthik:
        </p>

        <!-- Big OTP Card -->
        <div style="background: #191A23; border: 2.5px solid #191A23; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 24px; box-shadow: 4px 4px 0px #B9FF66;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #9CA3AF; margin-bottom: 6px;">
            ONE-TIME VERIFICATION CODE
          </div>
          <div style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #B9FF66; font-family: 'Courier New', Courier, monospace; margin: 6px 0;">
            ${otp}
          </div>
          <div style="font-size: 12px; color: #D1D5DB; margin-top: 6px;">
            Valid for the next ${expiresInMinutes} minutes
          </div>
        </div>

        <p style="font-size: 13.5px; line-height: 1.5; color: #6B7280; margin-bottom: 0;">
          <strong>Security notice:</strong> Do not share this code with anyone. If you did not request this, you can safely ignore this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background: #F9F9FB; padding: 16px 28px; border-top: 2px solid #191A23; font-size: 12px; color: #6B7280; text-align: center;">
        Verification sent from portfolio contact service at <strong>vijay-karthik.vercel.app</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Template 1: High-visibility notification sent to Vijay Karthik (ONLY after successful OTP verification)
 */
export function renderSelfNotificationHtml({ name, email, subject, message, receivedDate }) {
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
                ⚡ VERIFIED PORTFOLIO LEAD
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
                    <span style="display: inline-block; margin-left: 8px; background: #10B981; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;">✓ OTP Verified</span>
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
        Automated verified notification sent from your portfolio backend at <strong>vijay-karthik.vercel.app</strong>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Template 2: Professional confirmation receipt sent to the client / visitor (ONLY after successful OTP verification)
 */
export function renderClientConfirmationHtml({ name, email, subject, message }) {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject || 'Portfolio Inquiry');
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out!</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F3F3F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #191A23;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 2.5px solid #191A23; border-radius: 16px; box-shadow: 6px 6px 0px #191A23; overflow: hidden;">
    <!-- Top Positivus Lime Bar -->
    <tr>
      <td style="background-color: #B9FF66; padding: 24px 28px; border-bottom: 2.5px solid #191A23;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="display: inline-block; background-color: #191A23; color: #FFFFFF; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 8px;">
                MESSAGE CONFIRMATION
              </span>
              <h1 style="margin: 8px 0 0 0; color: #191A23; font-size: 22px; font-weight: 800; line-height: 1.25;">
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

    <!-- Body Information Box -->
    <tr>
      <td style="padding: 28px;">
        <p style="font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px; color: #191A23;">
          Hi <strong>${safeName}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          Thank you for confirming your email and getting in touch! I have received your message and will review it and get back to you as soon as possible.
        </p>

        <!-- Message Summary Card -->
        <div style="background: #F9F9FB; border: 2px solid #191A23; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; box-shadow: 3px 3px 0px #191A23;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; margin-bottom: 6px;">
            Summary of Your Inquiry (${safeSubject})
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

