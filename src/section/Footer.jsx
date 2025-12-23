import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter, FaTiktok } from 'react-icons/fa'
import logo from '../assets/logoctk.png'
import viteLogo from '/vite.svg' // Assuming logo is vite.svg, adjust if needed

const Footer = () => {
  return (
    <>
      <style>
        {`
          .footer-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .footer-section {
            flex: 2;
          }
          .footer-logo {
            flex: 1;
          }
          @media (max-width: 768px) {
            .footer-container {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .footer-section {
              flex: none;
              width: 100%;
              margin-bottom: 20px;
            }
            .footer-logo {
              flex: none;
              margin-bottom: 20px;
            }
            .footer-iframe {
              height: 150px !important;
            }
            .footer-padding {
              padding: 10px !important;
            }
            .footer-logo img {
              width: 40px !important;
              height: 40px !important;
            }
            .social-icons {
              gap: 10px !important;
              justify-content: center !important;
            }
            .social-icons svg {
              width: 20px !important;
              height: 20px !important;
            }
          }
        `}
      </style>
      <footer style={{ backgroundColor: '#46684d', color: 'white', padding: '20px' }} className="footer-padding">
        <div className="footer-container">
          <div className="footer-logo">
            <img src={logo} alt="Logo" style={{ width: '80px', height: '80px' }} />
          </div>
          <div className="footer-section">
            <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)', fontWeight: 'bold',color:'#742020dc' }}>Our Parish</h3>
            <p>Nairobi, Kenya</p>
            <p>Embakasi</p>
            <a href="tel:0202495785" className="text-one">
              0202495785
            </a>
            <p>Email: ctkcatholicparishemba@gmail.com</p>
            <div className="social-icons" style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <motion.div whileHover={{ scale: 1.1 }}>
                <FaFacebook size={24} style={{ color: 'white', cursor: 'pointer' }} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <FaInstagram size={24} style={{ color: 'white', cursor: 'pointer' }} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <FaWhatsapp size={24} style={{ color: 'white', cursor: 'pointer' }} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <FaTwitter size={24} style={{ color: 'white', cursor: 'pointer' }} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <FaTiktok size={24} style={{ color: 'white', cursor: 'pointer' }} />
              </motion.div>
            </div>
          </div>
          <div className="footer-section">
            <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)', fontWeight: 'bold',color:'#742020dc' }}>ABOUT US</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/mass-time" style={{ color: 'white', textDecoration: 'none' }}>Mass time</Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/parish-registration" style={{ color: 'white', textDecoration: 'none' }}>Parish Registration</Link>
                </motion.div>
              </li>
              <li>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/contact-us" style={{ color: 'white', textDecoration: 'none' }}>Contact us</Link>
                </motion.div>
              </li>
            </ul>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ marginTop: '20px' }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.1453947153996!2d36.91071652955815!3d-1.3085263372017901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f130003daf4c3%3A0x4136cf021e85c7aa!2sChrist%20The%20King%20Catholic%20Church%2C%20Embakasi!5e0!3m2!1sen!2ske!4v1761249573963!5m2!1sen!2ske"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Parish Location Map"
                className="footer-iframe"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
