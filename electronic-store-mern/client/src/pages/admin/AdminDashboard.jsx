import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign, FiTrendingUp, FiClock, FiArrowUpRight, FiBox } from 'react-icons/fi';
import { getAdminStats } from '../../api/admin';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dash">
        <div className="dash__loader">
          <div className="dash__spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dash">
        <div className="dash__error">
          <p>Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: <FiDollarSign />,
      gradient: 'linear-gradient(135deg, #00b894, #00cec9)',
      bg: 'rgba(0, 184, 148, 0.08)',
      border: 'rgba(0, 184, 148, 0.15)',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <FiShoppingCart />,
      gradient: 'linear-gradient(135deg, #6c5ce7, #a855f7)',
      bg: 'rgba(108, 92, 231, 0.08)',
      border: 'rgba(108, 92, 231, 0.15)',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: <FiPackage />,
      gradient: 'linear-gradient(135deg, #fdcb6e, #f39c12)',
      bg: 'rgba(253, 203, 110, 0.08)',
      border: 'rgba(253, 203, 110, 0.15)',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers />,
      gradient: 'linear-gradient(135deg, #fd79a8, #e84393)',
      bg: 'rgba(253, 121, 168, 0.08)',
      border: 'rgba(253, 121, 168, 0.15)',
    },
  ];

  const statusConfig = [
    { key: 'pending', label: 'Pending', color: '#ffc107' },
    { key: 'processing', label: 'Processing', color: '#a29bfe' },
    { key: 'shipped', label: 'Shipped', color: '#74b9ff' },
    { key: 'delivered', label: 'Delivered', color: '#55efc4' },
    { key: 'cancelled', label: 'Cancelled', color: '#ff7675' },
  ];

  const totalOrdersForBar = Object.values(stats.statusCounts || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="dash">
      {/* Header */}
      <div className="dash__header">
        <div>
          <h1 className="dash__title">Dashboard</h1>
          <p className="dash__subtitle">Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dash__stats">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="dash__stat-card"
            style={{ background: card.bg, borderColor: card.border }}
          >
            <div className="dash__stat-icon" style={{ background: card.gradient }}>
              {card.icon}
            </div>
            <div className="dash__stat-content">
              <span className="dash__stat-label">{card.label}</span>
              <h3 className="dash__stat-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Status breakdown + Recent Orders */}
      <div className="dash__grid">
        {/* Order Status Breakdown */}
        <div className="dash__card">
          <div className="dash__card-header">
            <h3><FiTrendingUp /> Order Status</h3>
          </div>
          <div className="dash__status-list">
            {statusConfig.map(({ key, label, color }) => {
              const count = stats.statusCounts[key] || 0;
              const pct = (count / totalOrdersForBar) * 100;
              return (
                <div key={key} className="dash__status-item">
                  <div className="dash__status-info">
                    <span className="dash__status-dot" style={{ background: color }} />
                    <span className="dash__status-name">{label}</span>
                    <span className="dash__status-count">{count}</span>
                  </div>
                  <div className="dash__status-bar">
                    <div
                      className="dash__status-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dash__card">
          <div className="dash__card-header">
            <h3><FiClock /> Recent Orders</h3>
            <Link to="/admin/orders" className="dash__card-action">
              View All <FiArrowUpRight />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="dash__empty">
              <FiBox />
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="dash__orders">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="dash__order-row">
                  <div className="dash__order-left">
                    <span className="dash__order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="dash__order-user">{order.user?.username || 'Unknown'}</span>
                  </div>
                  <div className="dash__order-right">
                    <span className={`dash__badge dash__badge--${order.status}`}>
                      {order.status}
                    </span>
                    <span className="dash__order-total">
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash__actions">
        <Link to="/admin/products" className="dash__action-card">
          <FiPackage />
          <div>
            <h4>Manage Products</h4>
            <p>Add, edit, or remove products</p>
          </div>
          <FiArrowUpRight className="dash__action-arrow" />
        </Link>
        <Link to="/admin/orders" className="dash__action-card">
          <FiShoppingCart />
          <div>
            <h4>Manage Orders</h4>
            <p>View and update order statuses</p>
          </div>
          <FiArrowUpRight className="dash__action-arrow" />
        </Link>
      </div>
    </div>
  );
}
