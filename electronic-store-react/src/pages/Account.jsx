import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import './Account.css';

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${isLogin ? 'Login' : 'Register'} submitted! (Demo only)`);
  };

  return (
    <div className="account-page">
      <section className="page-hero">
        <div className="page-hero__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="page-hero__label">Welcome</span>
            <h1 className="page-hero__title">Your Account</h1>
            <p className="page-hero__subtitle">
              {isLogin ? 'Sign in to access your orders and wishlist' : 'Create an account to get started'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="account__container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'auth-tab--active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'auth-tab--active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
            <div className={`auth-tabs__indicator ${!isLogin ? 'auth-tabs__indicator--right' : ''}`} />
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              className="auth-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="auth-form__group">
                <FiUser className="auth-form__icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <motion.div
                  className="auth-form__group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiMail className="auth-form__icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}

              <div className="auth-form__group">
                <FiLock className="auth-form__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-form__toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {isLogin && (
                <a href="#" className="auth-form__forgot">Forgot password?</a>
              )}

              <button type="submit" className="btn btn--primary btn--lg auth-form__submit">
                {isLogin ? 'Sign In' : 'Create Account'}
                <FiArrowRight />
              </button>

              <p className="auth-form__switch">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Register' : 'Sign In'}
                </button>
              </p>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
