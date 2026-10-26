/**
 * Email delivery via Resend.
 *
 * In development, if RESEND_API_KEY is not set, emails are logged to
 * the console instead of being sent. In production, the key must be
 * set (checked at startup in config).
 *
 * Important: Resend's send() resolves with { data, error } rather than
 * throwing on delivery failures. We inspect both the settled status
 * and the resolved error field.
 */

import { Resend } from 'resend';
import { config } from '../config/index.js';

let resend = null;
if (config.RESEND_API_KEY) {
  resend = new Resend(config.RESEND_API_KEY);
}

export const sendContactEmails = async ({ name, email, message }) => {
  if (!resend) {
    console.log('[Email stub] Contact from', { name, email });
    console.log('[Email stub] Message:', message);
    return { stubbed: true };
  }

  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message);

  const fromEmail = config.FROM_EMAIL || 'onboarding@resend.dev';

  const [adminResult, userResult] = await Promise.allSettled([
    resend.emails.send({
      from: `CTK Parish <${fromEmail}>`,
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
      replyTo: email,
    }),
    resend.emails.send({
      from: `CTK Parish <${fromEmail}>`,
      to: email,
      subject: 'Thank you for contacting Christ the King Parish',
      html: `
        <h2>Thank you, ${escapedName}!</h2>
        <p>We have received your message and will respond within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${escapedMessage}</blockquote>
        <p>May God bless you,<br>Christ the King Catholic Parish</p>
      `,
      replyTo: config.ADMIN_EMAIL,
    }),
  ]);

  const adminFailed =
    adminResult.status === 'rejected' ||
    (adminResult.status === 'fulfilled' && !!adminResult.value?.error);

  const userFailed =
    userResult.status === 'rejected' ||
    (userResult.status === 'fulfilled' && !!userResult.value?.error);

  if (adminFailed) {
    const reason =
      adminResult.status === 'rejected'
        ? adminResult.reason
        : adminResult.value.error;
    console.error('[Email] Admin notification failed:', reason);
    throw new Error('Failed to send contact notification');
  }

  if (userFailed) {
    const reason =
      userResult.status === 'rejected'
        ? userResult.reason
        : userResult.value.error;
    // The admin received the message; only the visitor's confirmation
    // failed. Do not tell the visitor their submission failed.
    console.error('[Email] User confirmation failed:', reason);
    return { sent: true, userConfirmationFailed: true };
  }

  return { sent: true };
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}