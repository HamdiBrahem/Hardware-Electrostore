import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiMenu, FiX, FiZap, FiUser, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <FiZap className="navbar__logo-icon" />
          <span className="navbar__logo-text">ElectroStore</span>
        </Link>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {['/', '/products', '/about', '/contact', user ? '/profile' : '/account'].map((path, i) => {
            const labels = ['Home', 'Products', 'About', 'Contact', user ? 'Profile' : 'Account'];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}
        </nav>

        <div className="navbar__actions">
          {user?.isAdmin && (
            <NavLink to="/admin" className="navbar__admin-btn" aria-label="Admin" title="Admin Panel">
              <FiSettings />
            </NavLink>
          )}

          <NavLink to={user ? '/profile' : '/account'} className="navbar__user-btn" aria-label="Account" title={user ? user.username : 'Account'}>
            <FiUser />
            {user && <span className="navbar__user-dot" />}
          </NavLink>

          <button className="navbar__cart-btn" onClick={toggleCart} aria-label="Open cart">
            <FiShoppingCart />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  className="navbar__cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={totalItems}
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="navbar__menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
