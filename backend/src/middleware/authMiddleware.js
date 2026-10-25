/**
 * Authentication and authorization.
 *
 * protect()    — verifies the Supabase JWT and loads the user's profile
 * adminOnly()  — restricts to users with role = 'admin'
 * editorOrAdmin() — restricts to users with role IN ('admin', 'editor')
 *
 * The frontend sends the token in an Authorization header:
 *   Authorization: Bearer <access_token>
 */

import { supabaseAdmin } from '../lib/supabaseClient.js';
import { AppError } from './errorMiddleware.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const token = header.slice(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new AppError('Invalid or expired token', 401);
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new AppError('User profile not found', 401);
    }
    if (!profile.is_active) {
      throw new AppError('Account is inactive', 403);
    }

    req.user = { ...user, ...profile };
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new AppError('Authentication failed', 401));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  next(new AppError('Admin access required', 403));
};

export const editorOrAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'editor') return next();
  next(new AppError('Editor or admin access required', 403));
};