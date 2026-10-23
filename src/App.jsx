import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Layout components
import Header from './section/Header';
import Footer from './section/Footer';

// Home sections
import Hero from './section/Hero';
import Livestream from './section/Livestream';
import ChurchTime from './section/ChurchTime';
import Event from './section/Event';
import Ministry from './section/Ministry';
import Mission from './section/Mission';

// Pages
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
import ScrollToTop from './components/ScrollToTop';

// --------------------
// Layout Wrapper
// --------------------
const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
    <ScrollToTop />
  </>
);

// --------------------
// Home Page
// --------------------
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

// --------------------
// App Routing
// --------------------
const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Layout Wrapper */}
        <Route path="/" element={<Layout />}>

          {/* Home */}
          <Route index element={<Home />} />

          {/* ---------------- ABOUT ---------------- */}
          
            
            <Route path="gallery" element={<PhotoAlbum />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="history" element={<History />} />
          

          {/* ---------------- LITURGY ---------------- */}
          
            <Route path="mass-times" element={<MassTime />} />
            <Route path="adoration" element={<AdorationTime />} />
            <Route path="confession" element={<ConfessionTime />} />
            <Route path='sacrament' element= {<Sacraments/>}/>
          

          {/* ---------------- EVENTS ---------------- */}
          
            <Route path="calendar" element={<Calendar />} />
            <Route path="announcements" element={<Announcements />} />
          

          {/* ---------------- MINISTRY ---------------- */}
          
            <Route path="readmore" element={<MinistryReadMore />} />
            <Route path="signup" element={<MinistrySignup />} />
          

          {/* ---------------- GENERAL ---------------- */}
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="parish-registration" element={<ParishRegistration />} />
          <Route path="staff" element={<Staff />} />

          {/* Optional future pages */}
          {/* <Route path="sacraments" element={<Sacraments />} /> */}
          {/* <Route path="new-here" element={<NewHere />} /> */}

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;