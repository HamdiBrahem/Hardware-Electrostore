import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Account.css';

export default function Account() {
  const { user, loading: authLoading, error: authError, login, register, setError } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (authError) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(form.username, form.password);
      } else {
        await register({ username: form.username, email: form.email, password: form.password });
      }
      setForm({ username: '', email: '', password: '' });
      navigate('/profile');
    } catch {
      // error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="account-page"><p style={{ textAlign: 'center', padding: '4rem' }}>Loading...</p></div>;
  }

  // Redirect logged-in users to profile
  if (user) {
    navigate('/profile');
    return null;
  }

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
                  placeholder={isLogin ? 'Username or Email' : 'Username'}
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
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-form__toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {authError && (
                <p className="form-error" style={{ textAlign: 'center', margin: '0.5rem 0' }}>{authError}</p>
              )}

              {isLogin && (
                <a href="#" className="auth-form__forgot">Forgot password?</a>
              )}

              <button type="submit" className="btn btn--primary btn--lg auth-form__submit" disabled={submitting}>
                {submitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!submitting && <FiArrowRight />}
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
