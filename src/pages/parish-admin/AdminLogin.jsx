/**
 * Admin login page.
 *
 * Clean, focused login form. Signs in via Supabase Auth. On success,
 * redirects to the dashboard (or the page the user originally tried
 * to reach).
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logoctk.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/parish-admin';

  useEffect(() => {
    document.title = 'Admin Login | Christ the King Parish';
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e4a2a] to-[#163a21] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Christ the King"
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[#800000]"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Parish Admin
            </h1>
            <p className="text-sm text-gray-500">
              Christ the King Catholic Parish
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#800000]
                           focus:border-transparent transition-all"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#800000]
                           focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#800000] text-white py-3 rounded-lg font-semibold
                         hover:bg-[#660000] transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Authorized personnel only. All activity is logged.
          </p>
        </div>

        <p className="text-center text-white/60 text-xs mt-4">
          <a href="/" className="hover:text-white transition-colors">
            ← Back to Website
          </a>
        </p>
      </motion.div>
    </div>
  );
}