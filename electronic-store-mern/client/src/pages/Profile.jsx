import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiLock, FiEdit3, FiSave, FiLogOut,
  FiPackage, FiCalendar, FiShield, FiChevronRight, FiCheck, FiX, FiEye, FiEyeOff
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { getMyOrders } from '../api/orders';
import './Profile.css';

export default function Profile() {
  const { user, logout, setError } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Profile form
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [changingPw, setChangingPw] = useState(false);

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/account');
  }, [user, navigate]);

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  // Load orders when tab switches
  useEffect(() => {
    if (activeTab === 'orders' && !ordersLoaded) {
      setOrdersLoading(true);
      getMyOrders()
        .then((res) => setOrders(res.data))
        .catch(() => setOrders([]))
        .finally(() => { setOrdersLoading(false); setOrdersLoaded(true); });
    }
  }, [activeTab, ordersLoaded]);

  const clearMessages = () => { setSuccess(''); setFormError(''); };

  const handleChange = (e) => {
    clearMessages();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    clearMessages();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      localStorage.setItem('token', res.data.token);
      // Reload page to refresh user in AuthContext
      window.location.reload();
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    clearMessages();
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (pwForm.newPassword.length < 6) {
      setFormError('New password must be at least 6 characters');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }

    setChangingPw(true);
    try {
      const res = await updateProfile({ password: pwForm.newPassword });
      localStorage.setItem('token', res.data.token);
      setSuccess('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setFormError(err.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const initials = (user.firstName && user.lastName)
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.username?.slice(0, 2).toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'orders', label: 'Orders', icon: <FiPackage /> },
  ];

  return (
    <div className="profile-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero__container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="page-hero__label">My Account</span>
            <h1 className="page-hero__title">Profile</h1>
            <p className="page-hero__subtitle">Manage your account information and preferences</p>
          </motion.div>
        </div>
      </section>

      <div className="profile__container">
        <div className="profile__layout">
          {/* Sidebar */}
          <motion.aside
            className="profile__sidebar"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="profile__avatar-section">
              <div className="profile__avatar">{initials}</div>
              <h3 className="profile__name">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
              </h3>
              <p className="profile__email">{user.email}</p>
              <div className="profile__member-since">
                <FiCalendar /> Member since {memberSince}
              </div>
            </div>

            <nav className="profile__nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`profile__nav-btn ${activeTab === tab.id ? 'profile__nav-btn--active' : ''}`}
                  onClick={() => { setActiveTab(tab.id); clearMessages(); }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <FiChevronRight className="profile__nav-arrow" />
                </button>
              ))}
            </nav>

            <button className="profile__logout-btn" onClick={handleLogout}>
              <FiLogOut /> Sign Out
            </button>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            className="profile__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {/* Success / Error messages */}
            {success && (
              <div className="profile__alert profile__alert--success">
                <FiCheck /> {success}
              </div>
            )}
            {formError && (
              <div className="profile__alert profile__alert--error">
                <FiX /> {formError}
              </div>
            )}

            {/* ===== PROFILE TAB ===== */}
            {activeTab === 'profile' && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2 className="profile__section-title">Personal Information</h2>
                    <p className="profile__section-desc">Update your personal details and contact info</p>
                  </div>
                  {!editing && (
                    <button className="profile__edit-btn" onClick={() => setEditing(true)}>
                      <FiEdit3 /> Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile}>
                  <div className="profile__fields">
                    <div className="profile__field">
                      <label className="profile__label">First Name</label>
                      <div className="profile__input-wrapper">
                        <FiUser className="profile__input-icon" />
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="First name"
                          className="profile__input"
                        />
                      </div>
                    </div>
                    <div className="profile__field">
                      <label className="profile__label">Last Name</label>
                      <div className="profile__input-wrapper">
                        <FiUser className="profile__input-icon" />
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="Last name"
                          className="profile__input"
                        />
                      </div>
                    </div>
                    <div className="profile__field">
                      <label className="profile__label">Username</label>
                      <div className="profile__input-wrapper">
                        <FiUser className="profile__input-icon" />
                        <input
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          disabled={!editing}
                          required
                          className="profile__input"
                        />
                      </div>
                    </div>
                    <div className="profile__field">
                      <label className="profile__label">Email Address</label>
                      <div className="profile__input-wrapper">
                        <FiMail className="profile__input-icon" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          disabled={!editing}
                          required
                          className="profile__input"
                        />
                      </div>
                    </div>
                  </div>

                  {editing && (
                    <div className="profile__actions">
                      <button type="button" className="btn btn--outline" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn--primary" disabled={saving}>
                        {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === 'security' && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2 className="profile__section-title">Security Settings</h2>
                    <p className="profile__section-desc">Manage your password and account security</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="profile__password-form">
                  <div className="profile__field">
                    <label className="profile__label">New Password</label>
                    <div className="profile__input-wrapper">
                      <FiLock className="profile__input-icon" />
                      <input
                        type={showPw.new ? 'text' : 'password'}
                        value={pwForm.newPassword}
                        onChange={(e) => { clearMessages(); setPwForm((p) => ({ ...p, newPassword: e.target.value })); }}
                        placeholder="Enter new password"
                        required
                        minLength={6}
                        className="profile__input"
                      />
                      <button
                        type="button"
                        className="profile__pw-toggle"
                        onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
                      >
                        {showPw.new ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="profile__field">
                    <label className="profile__label">Confirm New Password</label>
                    <div className="profile__input-wrapper">
                      <FiLock className="profile__input-icon" />
                      <input
                        type={showPw.confirm ? 'text' : 'password'}
                        value={pwForm.confirmPassword}
                        onChange={(e) => { clearMessages(); setPwForm((p) => ({ ...p, confirmPassword: e.target.value })); }}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                        className="profile__input"
                      />
                      <button
                        type="button"
                        className="profile__pw-toggle"
                        onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
                      >
                        {showPw.confirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="profile__actions">
                    <button type="submit" className="btn btn--primary" disabled={changingPw}>
                      {changingPw ? 'Updating...' : <><FiShield /> Update Password</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'orders' && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2 className="profile__section-title">Order History</h2>
                    <p className="profile__section-desc">View and track your past orders</p>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="profile__orders-loading">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="profile__orders-empty">
                    <FiPackage className="profile__orders-empty-icon" />
                    <p>No orders yet</p>
                    <span>When you place an order, it will appear here.</span>
                  </div>
                ) : (
                  <div className="profile__orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="profile__order-card">
                        <div className="profile__order-header">
                          <div>
                            <span className="profile__order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                            <span className="profile__order-date">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </span>
                          </div>
                          <span className={`profile__order-status profile__order-status--${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="profile__order-body">
                          <span className="profile__order-items">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </span>
                          <span className="profile__order-total">${order.totalPrice?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
