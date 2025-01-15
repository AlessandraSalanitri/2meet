"use client"; 

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";// Import social media icons
import "../styles/Footer.css"; // Import the styles for the Footer component

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Media Links */}
        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        </div>

        {/* Contact Information */}
        <div className="contact-info">
          <h3>Contact Us</h3>
          <p>Email: support@2meet.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Location: 123 Practice St, Anywhere</p>
        </div>

        {/* Business Hours */}
        <div className="hours">
          <h3>Business Hours</h3>
          <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
          <p>Saturday: 10:00 AM - 4:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 2Meet. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
