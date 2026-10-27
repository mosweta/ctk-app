/**
 * Admin login page.
 *
 * Clean, focused login form. Signs in via Supabase Auth. On success,
 * redirects to the dashboard (or the page the user originally tried
 * to reach).
 *
 * Theming:
 *   The outer gradient uses --color-base and --color-base-hover, so
 *   the page background shifts consistently in dark mode. The form
 *   card uses bg-surface with text-heading / text-body / text-muted
 *   tokens, so all text is legible in both themes.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logoctk.webp';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/parish-admin';

  const submittingRef = useRef(false);

  useEffect(() => {
    document.title = 'Admin Login | Christ the King Parish';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guard against double submits before React re-renders the
    // disabled state.
    if (submittingRef.current) return;
    submittingRef.current = true;

    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-background text-body border border-border-strong rounded-lg ' +
    'placeholder:text-subtle transition-all ' +
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base to-base-hover p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface rounded-2xl shadow-2xl p-8 md:p-10 border border-border">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt=""
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"
            />
            <h1 className="text-2xl font-bold text-heading mb-1">
              Parish Admin
            </h1>
            <p className="text-sm text-muted">
              Christ the King Catholic Parish
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
              className="bg-red-500/10 border border-red-500/30 text-danger px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-heading mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className={inputClass}
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-heading mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold
                         hover:bg-primary-hover transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-muted mt-8">
            Authorized personnel only. All activity is logged.
          </p>
        </div>

        <p className="text-center text-xs mt-4">
          <Link
            to="/"
            className="text-white/70 hover:text-white transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white/60 rounded-sm px-1 py-0.5"
          >
            ← Back to Website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}