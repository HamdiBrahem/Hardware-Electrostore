import request from './request';

export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (userData) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const getProfile = () => request('/auth/profile');

export const updateProfile = (userData) =>
  request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
