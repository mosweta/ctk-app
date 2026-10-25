/**
 * Footer
 *
 * Site-wide footer. Appears on every public page.
 *
 * Design notes:
 *   - Constrained to max-w-7xl to match the header width.
 *   - Three-column grid with an asymmetric ratio (1.3fr 1fr 1fr).
 *   - Uses bg-base (deep green) so it stays distinct in both themes.
 *   - Mass Hours card lists explicit times for both CTK and SJTE.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaHeart,
  FaChurch,
} from 'react-icons/fa';
import logo from '../assets/logoctk.png';

const QUICK_LINKS = [
  { name: 'Mass Times', path: '/mass-times' },
  { name: 'Daily Readings', path: '/readings' },
  { name: 'Announcements', path: '/announcements' },
  { name: 'Events Calendar', path: '/calendar' },
  { name: 'Groups & Jumuiyas', path: '/get-involved' },
  { name: 'Contact Us', path: '/contact' },
];

const SOCIAL = [
  {
    icon: FaFacebook,
    url: 'https://www.facebook.com/groups/44947225325/',
    label: 'Facebook',
  },
  {
    icon: FaInstagram,
    url: 'https://www.instagram.com/explore/locations/363520429/christ-the-king-catholic-church-embakasi/',
    label: 'Instagram',
  },
  {
    icon: FaTiktok,
    url: 'https://www.tiktok.com/@ctk_ysc',
    label: 'TikTok',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base text-on-base mt-auto">
      {/* Gold underline accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
                      py-16 md:py-20
                      grid gap-12 md:gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        {/* Parish identity + contact */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={logo}
              alt=""
              className="w-16 h-16 md:w-20 md:h-20 rounded-full
                         border-2 border-white/30"
            />
            <div>
              <h3 className="text-white font-bold text-xl md:text-2xl leading-tight">
                Christ the King
              </h3>
              <p className="text-sm text-white/70 italic">
                Catholic Parish, Embakasi
              </p>
            </div>
          </div>

          <div className="gap-6  mb-8 pb-4 ">
            <div className="flex flex-col mb-4 gap-3">
              <FooterContact  icon={FaMapMarkerAlt}>
              Embakasi, Nairobi, Kenya
              </FooterContact>
            </div>
            <div className="space-y-6 flex flex-col mb-4 gap-3">
              <FooterContact icon={FaPhone} href="tel:0202495785">
              020 2495785
            </FooterContact>
            </div>
            <div className="flex flex-col mb-4 gap-3">
              <FooterContact
              icon={FaEnvelope}
              href="mailto:ctkcatholicparishemba@gmail.com"
            >
              ctkcatholicparishemba@gmail.com
            </FooterContact>
            </div>
            
            
          </div>

          <div className="flex flex-col gap-3 ">
            <p className=" mt-6 text-xs font-bold uppercase tracking-wider text-accent mb-4">
              Follow Us
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ icon: Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="w-11 h-11 flex items-center justify-center
                             bg-white/5 rounded-full border border-white/20
                             hover:bg-primary hover:border-primary
                             hover:shadow-lg hover:shadow-primary/30
                             transition-all duration-200"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links + mass hours */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 pb-2
                         border-b-2 border-white/20 inline-block">
            Quick Links
          </h4>
          <ul className="space-y-3 mb-8">
            {QUICK_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm text-white/80 hover:text-accent
                             transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-accent/60" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mass Hours with explicit CTK and SJTE times */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm flex flex-col gap-4 ">
            <h5 className="flex items-center gap-2 text-accent font-bold
                           text-sm mb-4 uppercase tracking-wider">
              <FaClock size={16} /> Mass Hours
            </h5>
            
            {/* CTK Schedule */}
            <div className="mb-4 gap-6 ">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
                <FaChurch className="text-white/50" size={12} /> CTK
              </div>
              <ul className="space-y-1 text-sm text-white/80 pl-5 list-disc marker:text-white/30">
                <li>1st Mass: 7:00 AM - 9:00 AM</li>
                <li>2nd Mass: 9:00 AM - 11:00 AM</li>
                <li>3rd Mass: 11:00 AM - 1:00 PM</li>
                <li>4th Mass: 1:00 PM - 3:00 PM</li>
              </ul>
            </div>

            {/* SJTE Schedule */}
            <div className="mb-4 gap-6 f pt-10 border-t border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
                <FaChurch className="text-white/50" size={12} /> SJTE
              </div>
              <ul className="space-y-1 text-sm text-white/80 pl-5 list-disc marker:text-white/30">
                <li>1st Mass: 8:00 AM - 10:00 AM</li>
                <li>2nd Mass: 10:00 AM - 12:00 PM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map + directions */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6 pb-2
                         border-b-2 border-white/20 inline-block">
            Find Us
          </h4>
          <div className="rounded-xl overflow-hidden border-2 border-white/10
                          mb-4 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.1453947153996!2d36.91071652955815!3d-1.3085263372017901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f130003daf4c3%3A0x4136cf021e85c7aa!2sChrist%20The%20King%20Catholic%20Church%2C%20Embakasi!5e0!3m2!1sen!2ske!4v1761249573963!5m2!1sen!2ske"
              title="Parish Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-52 border-0"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Christ+The+King+Catholic+Church+Embakasi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full gap-2
                       text-sm font-semibold text-white
                       border border-white/30 rounded-lg px-4 py-3
                       hover:bg-white hover:text-base transition-colors h-10"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20 h-16 flex items-center justify-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8
                        py-5 flex flex-col sm:flex-row justify-between
                        items-center gap-3 text-xs text-white/60">
          <p>
            {year} Christ the King Catholic Church, Embakasi. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with{' '}
            <FaHeart className="text-primary animate-pulse" size={12} /> for
            the glory of God
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterContact({ icon: Icon, href, children }) {
  const Cmp = href ? 'a' : 'div';
  return (
    <Cmp
      {...(href ? { href } : {})}
      className="flex items-start gap-3 text-sm text-white/85
                 hover:text-white transition-colors"
    >
      <Icon className="text-accent mt-0.5 shrink-0" size={16} />
      <span className="break-words">{children}</span>
    </Cmp>
  );
}