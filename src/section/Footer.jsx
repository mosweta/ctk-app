import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTwitter, 
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaHeart
} from 'react-icons/fa';
import logo from '../assets/logoctk.png';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Mass Times', path: '/liturgy/mass-times' },
    { name: 'Announcements', path: '/events/announcements' },
    { name: 'Contact Us', path: '/about/contact' },
    { name: 'Photo Album', path: '/about/gallery' },
    { name: 'Events Calendar', path: '/events/calendar' }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: 'https://www.facebook.com/groups/44947225325/', label: 'Facebook' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/explore/locations/363520429/christ-the-king-catholic-church-embakasi/', label: 'Instagram' },
    { icon: <FaTiktok />, url: 'https://www.tiktok.com/@ctk_ysc/video/7620100499345296647', label: 'TikTok' }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <footer className="footer">
      {/* Decorative top border */}
      <div className="footer-top-border"></div>
      
      <div className="footer-container">
        {/* Logo & Info Section */}
        <motion.div 
          className="footer-logo-section"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.img 
            src={logo} 
            alt="Christ the King Logo" 
            className="footer-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <h3 className="footer-parish-name">Christ the King</h3>
          <p className="footer-parish-subtitle">Catholic Church, Embakasi</p>
          
          <div className="footer-contact-info">
            <motion.div 
              className="contact-item"
              whileHover={{ x: 5 }}
            >
              <FaMapMarkerAlt className="contact-icon" />
              <span>Embakasi, Nairobi, Kenya</span>
            </motion.div>
            
            <motion.a 
              href="tel:0202495785" 
              className="contact-item"
              whileHover={{ x: 5 }}
            >
              <FaPhone className="contact-icon" />
              <span>020 2495785</span>
            </motion.a>
            
            <motion.a 
              href="mailto:ctkcatholicparishemba@gmail.com" 
              className="contact-item"
              whileHover={{ x: 5 }}
            >
              <FaEnvelope className="contact-icon" />
              <span>ctkcatholicparishemba@gmail.com</span>
            </motion.a>
          </div>

          <div className="footer-social">
            <h4>Connect With Us</h4>
            <motion.div 
              className="social-icons"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  variants={fadeInUp}
                  whileHover={{ y: -5, backgroundColor: '#800000' }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div 
          className="footer-links-section"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="footer-section-title">Quick Links</h3>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <motion.li 
                key={index}
                variants={fadeInUp}
                whileHover={{ x: 5 }}
              >
                <Link to={link.path} className="footer-link">
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div 
            className="footer-hours"
            variants={fadeInUp}
          >
            <h4>
              <FaClock className="hours-icon" />
              Mass Hours
            </h4>
            <p>Sunday: 7:00 AM - 1:00 PM</p>
            <p>Monday-Saturday: 7:00 AM</p>
            
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div 
          className="footer-map-section"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="footer-section-title">Find Us</h3>
          <motion.div 
            className="map-container"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.1453947153996!2d36.91071652955815!3d-1.3085263372017901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f130003daf4c3%3A0x4136cf021e85c7aa!2sChrist%20The%20King%20Catholic%20Church%2C%20Embakasi!5e0!3m2!1sen!2ske!4v1761249573963!5m2!1sen!2ske"
              title="Parish Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="footer-map"
            ></iframe>
          </motion.div>
          <motion.a 
            href="https://maps.google.com/?q=Christ+The+King+Catholic+Church+Embakasi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="directions-link"
            whileHover={{ x: 5 }}
          >
            Get Directions →
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="footer-bottom-container">
          <p className="copyright">
            © {currentYear} Christ the King Catholic Church, Embakasi. All rights reserved.
          </p>
          <p className="credit">
            Made with <FaHeart className="heart-icon" /> for the glory of God
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;