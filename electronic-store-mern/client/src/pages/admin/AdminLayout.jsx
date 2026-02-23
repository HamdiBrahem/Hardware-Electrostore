import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingCart, FiArrowLeft, FiZap, FiLogOut, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import './Admin.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!user) navigate('/account');
    else if (!user.isAdmin) navigate('/');
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  const navItems = [
    { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <FiPackage />, label: 'Products' },
    { to: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`admin ${collapsed ? 'admin--collapsed' : ''}`}>
      <aside className="admin__sidebar">
        {/* Brand */}
        <div className="admin__brand">
          <div className="admin__brand-icon">
            <FiZap />
          </div>
          <div className="admin__brand-text">
            <h2>ElectroStore</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          className="admin__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FiChevronRight />
        </button>

        {/* Navigation */}
        <nav className="admin__nav">
          <p className="admin__nav-label">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin__nav-link ${isActive ? 'admin__nav-link--active' : ''}`
              }
            >
              <span className="admin__nav-icon">{item.icon}</span>
              <span className="admin__nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin__sidebar-footer">
          <button className="admin__footer-btn" onClick={() => navigate('/')}>
            <FiArrowLeft />
            <span>Back to Store</span>
          </button>
          <button className="admin__footer-btn admin__footer-btn--logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Log Out</span>
          </button>

          <div className="admin__user-card">
            <div className="admin__user-avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="admin__user-info">
              <p className="admin__user-name">{user.username}</p>
              <p className="admin__user-role">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}
