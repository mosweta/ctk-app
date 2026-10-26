/**
 * Public form submissions.
 *
 * Currently handles:
 *   - Contact form (verifies reCAPTCHA, sends email via Resend, or
 *     logs in dev)
 *   - Parish and Ministry registrations (saved to registrations table)
 *
 * Anti-spam is limited to rate limiting for now. reCAPTCHA verification
 * is done server-side using RECAPTCHA_SECRET; the token never leaves
 * the backend.
 */

import { supabaseAdmin } from '../lib/supabaseClient.js';
import { sendContactEmails } from '../services/emailService.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { config } from '../config/index.js';

// ---------------------------------------------------------------------
// reCAPTCHA verification
// ---------------------------------------------------------------------
const verifyRecaptcha = async (token, secret) => {
  if (!secret) {
    // In production, missing secret is a configuration error — fail
    // closed rather than silently accepting unverified submissions.
    if (config.NODE_ENV === 'production') {
      throw new AppError('reCAPTCHA is not configured', 500);
    }
    console.warn(
      '[reCAPTCHA] RECAPTCHA_SECRET not set — skipping verification in dev.'
    );
    return true;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  }).toString();

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (!data.success) {
    console.warn('[reCAPTCHA] verification failed:', {
      errors: data['error-codes'],
    });
    return false;
  }

  // reCAPTCHA v2 returns a boolean success. If the project ever moves
  // to v3, add a score threshold here.
  return true;
};

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message, token } = req.body;

    const isHuman = await verifyRecaptcha(token, config.RECAPTCHA_SECRET);
    if (!isHuman) {
      throw new AppError('reCAPTCHA verification failed. Please try again.', 403);
    }

    await sendContactEmails({ name, email, message });

    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const submitRegistration = async (req, res, next) => {
  try {
    const { type, name, email, phone, data } = req.body;

    // Prevent duplicate submissions within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('email', email)
      .eq('type', type)
      .gte('created_at', fiveMinutesAgo)
      .maybeSingle();

    if (recent) {
      throw new AppError(
        'A registration with this email was just submitted. Please wait a few minutes.',
        429
      );
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('registrations')
      .insert({ type, name, email, phone, data: data || {} })
      .select('id')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Registration received',
      data: { id: inserted.id },
    });
  } catch (err) {
    next(err);
  }
};