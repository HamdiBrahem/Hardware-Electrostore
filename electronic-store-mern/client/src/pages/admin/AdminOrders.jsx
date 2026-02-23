import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus } from '../../api/admin';
import './AdminOrders.css';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: '#ffc107',
  processing: '#a29bfe',
  shipped: '#5faeff',
  delivered: '#00ce9e',
  cancelled: '#ff6b6b',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      o._id.toLowerCase().includes(q) ||
      (o.user?.username || '').toLowerCase().includes(q) ||
      (o.user?.email || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} orders total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-orders__filters">
        <div className="admin-search" style={{ marginBottom: 0 }}>
          <FiSearch className="admin-search__icon" />
          <input
            type="text"
            placeholder="Search by order ID, user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search__input"
          />
        </div>

        <div className="admin-orders__status-filter">
          <FiFilter style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-orders__select"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="admin-orders__pills">
        <button
          className={`admin-orders__pill ${statusFilter === 'all' ? 'admin-orders__pill--active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              className={`admin-orders__pill ${statusFilter === s ? 'admin-orders__pill--active' : ''}`}
              onClick={() => setStatusFilter(s)}
              style={statusFilter === s ? { borderColor: statusColors[s], color: statusColors[s] } : {}}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <p className="admin-loading">Loading orders...</p>
      ) : filtered.length === 0 ? (
        <p className="admin-loading">No orders found.</p>
      ) : (
        <div className="admin-orders__list">
          {filtered.map((order) => (
            <div key={order._id} className="admin-order-card">
              <div className="admin-order-card__header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                <div className="admin-order-card__left">
                  <span className="admin-order-card__id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="admin-order-card__user">
                    {order.user?.username || 'Unknown'} — {order.user?.email || ''}
                  </span>
                  <span className="admin-order-card__date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="admin-order-card__right">
                  <span className="admin-order-card__total">${order.totalPrice?.toFixed(2)}</span>
                  <span className={`admin-order-badge admin-order-badge--${order.status}`}>
                    {order.status}
                  </span>
                  <FiChevronDown className={`admin-order-card__chevron ${expanded === order._id ? 'admin-order-card__chevron--open' : ''}`} />
                </div>
              </div>

              {expanded === order._id && (
                <div className="admin-order-card__details">
                  {/* Items */}
                  <div className="admin-order-card__section">
                    <h4>Items ({order.items?.length || 0})</h4>
                    <div className="admin-order-card__items">
                      {order.items?.map((item, i) => (
                        <div key={i} className="admin-order-card__item">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <span className="admin-order-card__item-name">{item.name}</span>
                            <span className="admin-order-card__item-qty">Qty: {item.quantity} × ${item.price?.toFixed(2)}</span>
                          </div>
                          <span className="admin-order-card__item-total">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="admin-order-card__section">
                    <h4>Shipping Address</h4>
                    <p>
                      {order.shippingAddress?.address}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                      {order.shippingAddress?.country}
                    </p>
                  </div>

                  {/* Status Update */}
                  <div className="admin-order-card__section">
                    <h4>Update Status</h4>
                    <div className="admin-order-card__status-btns">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          className={`admin-order-card__status-btn ${order.status === s ? 'admin-order-card__status-btn--active' : ''}`}
                          style={order.status === s ? { background: `${statusColors[s]}22`, color: statusColors[s], borderColor: statusColors[s] } : {}}
                          onClick={() => handleStatusChange(order._id, s)}
                          disabled={updating === order._id || order.status === s}
                        >
                          {updating === order._id ? '...' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
