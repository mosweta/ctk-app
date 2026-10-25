/**
 * Configuration loader.
 *
 * Reads environment variables and exposes them as a typed object. In
 * production, refuses to start if required variables are missing.
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL || 'onboarding@resend.dev',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET,
};

// Hard requirements — the app cannot run without these.
const requiredInProduction = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const requiredAlways = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

for (const key of requiredAlways) {
  if (!config[key]) {
    console.error(`Missing required environment variable: ${key}`);
    if (config.NODE_ENV === 'production') process.exit(1);
  }
}

if (config.NODE_ENV === 'production') {
  for (const key of requiredInProduction) {
    if (!config[key]) process.exit(1);
  }
}