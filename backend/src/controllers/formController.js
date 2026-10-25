/**
 * Public form submissions.
 *
 * Currently handles:
 *   - Contact form (sends email via Resend, or logs in dev)
 *   - Parish and Ministry registrations (saved to registrations table)
 *
 * Anti-spam is limited to rate limiting for now. reCAPTCHA verification
 * can be added when the frontend is wired up.
 */

import { supabaseAdmin } from '../lib/supabaseClient.js';
import { sendContactEmails } from '../services/emailService.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    await sendContactEmails({ name, email, message });

    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (err) { next(err); }
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
      throw new AppError('A registration with this email was just submitted. Please wait a few minutes.', 429);
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
  } catch (err) { next(err); }
};