import request from './request';

export const createOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const getMyOrders = () => request('/orders/mine');

export const getOrder = (id) => request(`/orders/${id}`);
