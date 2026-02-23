import request from './request';

// Dashboard stats
export const getAdminStats = () => request('/admin/stats');

// Users
export const getAdminUsers = () => request('/admin/users');

// Products (admin CRUD)
export const createProduct = (data) =>
  request('/products', { method: 'POST', body: JSON.stringify(data) });

export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: 'DELETE' });

// Orders (admin)
export const getAllOrders = () => request('/orders/admin/all');

export const updateOrderStatus = (id, status) =>
  request(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
