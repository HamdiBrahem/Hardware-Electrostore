import request from '../../api/request';

describe('API Request Helper', () => {
  const mockResponse = (data, ok = true, status = 200) => {
    return Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    });
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should make a GET request to the correct URL', async () => {
    global.fetch.mockImplementation(() => mockResponse({ success: true }));

    await request('/products');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('snapshot: GET request call args', async () => {
    global.fetch.mockImplementation(() => mockResponse({ success: true }));
    await request('/products');
    expect(global.fetch.mock.calls[0]).toMatchSnapshot();
  });

  it('should include auth token when available', async () => {
    localStorage.setItem('token', 'test-token-123');
    global.fetch.mockImplementation(() => mockResponse({ success: true }));

    await request('/products');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/products',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-123',
        }),
      })
    );
  });

  it('should not include auth header when no token exists', async () => {
    global.fetch.mockImplementation(() => mockResponse({ success: true }));

    await request('/products');

    const callHeaders = global.fetch.mock.calls[0][1].headers;
    expect(callHeaders.Authorization).toBeUndefined();
  });

  it('should return parsed JSON data on success', async () => {
    const data = { success: true, data: [{ id: 1, name: 'Test' }] };
    global.fetch.mockImplementation(() => mockResponse(data));

    const result = await request('/products');
    expect(result).toEqual(data);
  });

  it('should throw error on failed response', async () => {
    global.fetch.mockImplementation(() =>
      mockResponse({ message: 'Not found' }, false, 404)
    );

    await expect(request('/products/999')).rejects.toThrow('Not found');
  });

  it('should throw generic error when no message in response', async () => {
    global.fetch.mockImplementation(() =>
      mockResponse({}, false, 500)
    );

    await expect(request('/fail')).rejects.toThrow('Something went wrong');
  });

  it('should pass custom method and body', async () => {
    global.fetch.mockImplementation(() => mockResponse({ success: true }));

    await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
      })
    );
  });

  it('snapshot: POST request call args', async () => {
    global.fetch.mockImplementation(() => mockResponse({ success: true }));
    await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
    });
    expect(global.fetch.mock.calls[0]).toMatchSnapshot();
  });
});
