/**
 * Protected route wrapper.
 *
 * Redirects unauthenticated users to /parish-admin/login.
 * Shows a loading state while the auth session is being checked.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/parish-admin" element={<AdminLayout />} />
 *   </Route>
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#800000] border-t-transparent animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/parish-admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}