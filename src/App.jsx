/**
 * App
 *
 * Router configuration. Public pages are statically imported because
 * they are part of the initial payload the visitor downloads. Admin
 * pages are lazily loaded so a public visitor never pays for the
 * admin bundle.
 *
 * Code splitting:
 *   - AdminLogin, AdminLayout, and every admin manager are lazy.
 *   - Vite generates a separate chunk per lazy component.
 *   - A single Suspense boundary at the top of <Routes> shows a
 *     theme-aware fallback while a chunk is loading.
 *
 * Note: <Suspense> sits *outside* <Routes> in this app because the
 * route tree is nested. React Router v7 will render the fallback
 * whenever any descendant lazy component suspends.
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Layout components — eager (needed on almost every public page)
import Header from './section/Header';
import Footer from './section/Footer';
import ScrollToTop from './components/ScrollToTop';

// Home sections — eager (homepage is the initial route)
import Hero from './section/Hero';
import Livestream from './section/Livestream';
import ChurchTime from './section/ChurchTime';
import Event from './section/Event';
import Ministry from './section/Ministry';
import Mission from './section/Mission';

// Public pages — eager (share the initial payload with the public site)
import MinistryReadMore from './pages/MinistryReadMore';
import MinistrySignup from './pages/MinistrySignup';
import MassTime from './pages/MassTime';
import ParishRegistration from './pages/ParishRegistration';
import Staff from './pages/Staff';
import PhotoAlbum from './pages/PhotoAlbum';
import AdorationTime from './pages/AdorationTime';
import ConfessionTime from './pages/ConfessionTime';
import Calendar from './pages/Calendar';
import GetInvolved from './pages/GetInvolved';
import ContactUs from './pages/ContactUs';
import Announcements from './pages/Announcements';
import Sacraments from './pages/Sacraments';
import History from './pages/History';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import GroupDetail from './pages/GroupDetail';
import DailyReadings from './pages/DailyReadings';
import Give from './pages/Give';

// Auth & theme — eager (wrappers, must be present before any route)
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// ---------------------------------------------------------------------
// Lazy-loaded admin area
// ---------------------------------------------------------------------
// Every one of these will produce a separate chunk. The public site
// loads none of them until the visitor navigates to an admin route.
const AdminLogin = lazy(() => import('./pages/parish-admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/parish-admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/parish-admin/Dashboard'));
const EventsManager = lazy(() => import('./pages/parish-admin/EventsManager'));
const BulletinsManager = lazy(() =>
  import('./pages/parish-admin/BulletinsManager')
);
const GalleryManager = lazy(() =>
  import('./pages/parish-admin/GalleryManager')
);
const GroupsManager = lazy(() => import('./pages/parish-admin/GroupsManager'));
const SettingsManager = lazy(() =>
  import('./pages/parish-admin/SettingsManager')
);
const StaffManager = lazy(() => import('./pages/parish-admin/StaffManager'));
const LivestreamsManager = lazy(() =>
  import('./pages/parish-admin/LivestreamsManager')
);

// ---------------------------------------------------------------------
// Fallback shown while a lazy chunk is loading.
// Matches the rest of the site's theme tokens so it works in both
// light and dark mode. aria-live="polite" so screen readers know a
// page is loading without stealing focus.
// ---------------------------------------------------------------------
function RouteFallback() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
    <ScrollToTop />
  </>
);

const Home = () => (
  <>
    <Hero />
    <ChurchTime />
    <Mission />
    <Event />
    <Ministry />
    <Livestream />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>

              {/* ============ ADMIN ROUTES ============ */}
              <Route path="/parish-admin/login" element={<AdminLogin />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/parish-admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="events" element={<EventsManager />} />
                  <Route path="announcements" element={<BulletinsManager />} />
                  <Route path="gallery" element={<GalleryManager />} />
                  <Route path="groups" element={<GroupsManager />} />
                  <Route path="settings" element={<SettingsManager />} />
                  <Route path="staff" element={<StaffManager />} />
                  <Route path="livestreams" element={<LivestreamsManager />} />
                </Route>
              </Route>

              {/* ============ PUBLIC ROUTES ============ */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                {/* About */}
                <Route path="gallery" element={<PhotoAlbum />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="history" element={<History />} />

                {/* Liturgy */}
                <Route path="mass-times" element={<MassTime />} />
                <Route path="adoration" element={<AdorationTime />} />
                <Route path="confession" element={<ConfessionTime />} />
                <Route path="sacrament" element={<Sacraments />} />
                <Route path="readings" element={<DailyReadings />} />

                {/* Events */}
                <Route path="events" element={<EventsList />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="announcements" element={<Announcements />} />

                {/* Ministry */}
                <Route path="readmore" element={<MinistryReadMore />} />
                <Route path="signup" element={<MinistrySignup />} />

                {/* General */}
                <Route path="get-involved" element={<GetInvolved />} />
                <Route path="groups/:slug" element={<GroupDetail />} />
                <Route
                  path="parish-registration"
                  element={<ParishRegistration />}
                />
                <Route path="staff" element={<Staff />} />
                <Route path="give" element={<Give />} />
              </Route>

            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;