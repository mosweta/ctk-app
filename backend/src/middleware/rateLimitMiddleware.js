/**
 * Rate limiting.
 *
 * apiLimiter   — general API protection (100 requests per 15 min per IP)
 * formLimiter  — stricter limit for public form submissions (10 per hour)
 * authLimiter  — very strict for auth-sensitive routes if needed later
 */

import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});