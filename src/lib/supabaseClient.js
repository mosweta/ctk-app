/**
 * Frontend Supabase client.
 *
 * Used ONLY for authentication (sign in, sign out, session tracking).
 * All data reads/writes go through the Express API (see apiClient.js).
 * This keeps the frontend decoupled from the database schema and
 * ensures all business logic lives in one place.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase credentials. Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);