import { Link } from 'react-router-dom';
import { FiZap, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 720,0 1440,60 L1440,100 L0,100 Z" fill="rgba(108,92,231,0.08)" />
        </svg>
      </div>

      <div className="footer__container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <FiZap className="footer__logo-icon" />
              <span>ElectroStore</span>
            </div>
            <p className="footer__description">
              Our purpose is to make premium hardware affordable to everyone. Quality electronics, unbeatable prices.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="footer__social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="footer__social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="footer__social-link" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/products" className="footer__link">Products</Link>
            <Link to="/about" className="footer__link">About Us</Link>
            <Link to="/contact" className="footer__link">Contact</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Support</h4>
            <a href="#" className="footer__link">Return Policy</a>
            <a href="#" className="footer__link">Warranty</a>
            <a href="#" className="footer__link">FAQs</a>
            <a href="#" className="footer__link">Shipping Info</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <div className="footer__contact-item">
              <FiMapPin />
              <span>123 Tech Street, CA 94000</span>
            </div>
            <div className="footer__contact-item">
              <FiPhone />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="footer__contact-item">
              <FiMail />
              <span>support@electrostore.com</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} ElectroStore — Hamdi Brahem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
