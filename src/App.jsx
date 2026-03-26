import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './section/Header'
import Hero from './section/Hero'
import Footer from './section/Footer'
import Livestream from './section/Livestream'
import ChurchTime from './section/ChurchTime'
import Event from './section/Event'
import Ministry from './section/Ministry'
import Mission from './section/Mission'
import MinistryReadMore from './pages/MinistryReadMore'
import MinistrySignup from './pages/MinistrySignup'
import MassTime from './pages/MassTime'
import ParishRegistration from './pages/ParishRegistration'
import Staff from './pages/Staff'
import PhotoAlbum from './pages/PhotoAlbum'
import AdorationTime from './pages/AdorationTime'
import ConfessionTime from './pages/ConfessionTime'
import Calendar from './pages/Calendar'
import GetInvolved from './pages/GetInvolved'
//import ContactUs from './pages/ContactUs'
import ContactForm from './pages/Contactform'
import Announcements from './pages/Announcements'

const Home = () => (
  <>
    <Header />
    <Hero />
    <Livestream />
    <ChurchTime />
    <Ministry />
    <Mission />
    <Event />
    <Footer />
  </>
)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ministry/readmore" element={<MinistryReadMore />} />
        <Route path="/ministry/signup" element={<MinistrySignup />} />
        <Route path="/mass-time" element={<MassTime />} />
        <Route path="/parish-registration" element={<ParishRegistration />} />
        <Route path="/contact-us" element={<ContactForm />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/photo-album" element={<PhotoAlbum />} />
        <Route path="/adoration-time" element={<AdorationTime />} />
        <Route path="/confession-time" element={<ConfessionTime />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/announcements" element={<Announcements />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App