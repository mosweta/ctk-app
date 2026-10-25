/**
 * API client.
 *
 * Wraps fetch calls to the Express backend. Handles JSON parsing,
 * auth token injection, and error normalization.
 *
 * Usage:
 *   api.get('/events')                     // Public endpoint
 *   api.authGet('/admin/dashboard')        // Protected endpoint (adds Bearer token)
 *   api.post('/contact', { ... })          // Public POST
 *   api.authPost('/admin/events', { ... }) // Protected POST
 */

import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL ;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const request = async (endpoint, options = {}) => {
  const { method = 'GET', body, requiresAuth = false } = options;

  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(data.message || 'Request failed', res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Network error or JSON parse error
    throw new ApiError(
      err.message || 'Network error. Please check your connection.',
      0,
      null
    );
  }
};

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  authGet: (endpoint) => request(endpoint, { requiresAuth: true }),
  authPost: (endpoint, body) => request(endpoint, { method: 'POST', body, requiresAuth: true }),
  authPut: (endpoint, body) => request(endpoint, { method: 'PUT', body, requiresAuth: true }),
  authDelete: (endpoint) => request(endpoint, { method: 'DELETE', requiresAuth: true }),
};