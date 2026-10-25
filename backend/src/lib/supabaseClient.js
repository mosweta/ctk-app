/**
 * Supabase admin client.
 *
 * Uses the service_role key, which bypasses Row Level Security. This is
 * safe on the backend because all access is already gated by our own
 * auth middleware. The service_role key MUST NEVER be sent to the
 * browser.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';

export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);