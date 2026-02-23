import request from './request';

export const submitContact = (formData) =>
  request('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
