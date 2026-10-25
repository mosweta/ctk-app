/**
 * Email delivery via Resend.
 *
 * In development, if RESEND_API_KEY is not set, emails are logged to the
 * console instead of being sent. In production, the key must be set
 * (checked at startup in config).
 */

import { Resend } from 'resend';
import { config } from '../config/index.js';

let resend = null;
if (config.RESEND_API_KEY) {
  resend = new Resend(config.RESEND_API_KEY);
}

/**
 * Send a contact-form notification to the parish admin and a
 * confirmation to the user.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.message
 */
export const sendContactEmails = async ({ name, email, message }) => {
  if (!resend) {
    console.log('[Email stub] Contact from', { name, email });
    console.log('[Email stub] Message:', message);
    return { stubbed: true };
  }

  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message);

  const [adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: `CTK Parish <${config.FROM_EMAIL}>`,
      to: config.ADMIN_EMAIL,
      subject: `New contact form message from ${escapedName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${escapedMessage}</blockquote>
        <p style="color:#888;font-size:12px;">Received: ${new Date().toLocaleString()}</p>
      `,
      reply_to: email,
    }),
    resend.emails.send({
      from: `CTK Parish <${config.FROM_EMAIL}>`,
      to: email,
      subject: 'Thank you for contacting Christ the King Parish',
      html: `
        <h2>Thank you, ${escapedName}!</h2>
        <p>We have received your message and will respond within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${escapedMessage}</blockquote>
        <p>May God bless you,<br>Christ the King Catholic Parish</p>
      `,
      reply_to: config.ADMIN_EMAIL,
    }),
  ]);

  if (adminResult.status === 'rejected') {
    console.error('Admin email failed:', adminResult.reason);
    throw new Error('Failed to send contact notification');
  }

  return { sent: true };
};

/**
 * Minimal HTML escaping to prevent injection in email bodies.
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}