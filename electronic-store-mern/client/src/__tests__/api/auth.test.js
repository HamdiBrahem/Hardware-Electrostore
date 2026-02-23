import { login, register, getProfile, updateProfile } from '../../api/auth';
import request from '../../api/request';

jest.mock('../../api/request');

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call login with correct params', async () => {
    request.mockResolvedValue({ success: true, data: { token: 'abc' } });

    await login('test@example.com', 'password123');

    expect(request).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });
  });

  it('snapshot: login call args', async () => {
    request.mockResolvedValue({ success: true, data: { token: 'abc' } });
    await login('test@example.com', 'password123');
    expect(request.mock.calls[0]).toMatchSnapshot();
  });

  it('should call register with correct params', async () => {
    const userData = { username: 'testuser', email: 'test@example.com', password: '123456' };
    request.mockResolvedValue({ success: true });

    await register(userData);

    expect(request).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  });

  it('should call getProfile', async () => {
    request.mockResolvedValue({ success: true, data: { username: 'test' } });

    await getProfile();

    expect(request).toHaveBeenCalledWith('/auth/profile');
  });

  it('should call updateProfile with PUT method', async () => {
    const updateData = { firstName: 'Updated' };
    request.mockResolvedValue({ success: true });

    await updateProfile(updateData);

    expect(request).toHaveBeenCalledWith('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  });
});
