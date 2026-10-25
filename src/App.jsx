import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Layout components
import Header from './section/Header';
import Footer from './section/Footer';
import ScrollToTop from './components/ScrollToTop';

// Home sections
import Hero from './section/Hero';
import Livestream from './section/Livestream';
import ChurchTime from './section/ChurchTime';
import Event from './section/Event';
import Ministry from './section/Ministry';
import Mission from './section/Mission';

// Public pages
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

// Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin pages
import AdminLogin from './pages/parish-admin/AdminLogin';
import AdminLayout from './pages/parish-admin/AdminLayout';
import AdminDashboard from './pages/parish-admin/Dashboard';
import EventsManager from './pages/parish-admin/EventsManager';
import BulletinsManager from './pages/parish-admin/BulletinsManager';
import GalleryManager from './pages/parish-admin/GalleryManager';
import GroupsManager from './pages/parish-admin/GroupsManager';
import SettingsManager from './pages/parish-admin/SettingsManager';
import ReadingsManager from './pages/parish-admin/ReadingsManager';
import StaffManager from './pages/parish-admin/StaffManager';
import LivestreamsManager from './pages/parish-admin/LivestreamsManager';

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
      <AuthProvider>
        <Routes>

          {/* ============ ADMIN ROUTES ============ */}
          <Route path="/parish-admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/parish-admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="announcements" element={<BulletinsManager />} />
              <Route path="readings" element={<ReadingsManager />} />
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
            <Route path="parish-registration" element={<ParishRegistration />} />
            <Route path="staff" element={<Staff />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;