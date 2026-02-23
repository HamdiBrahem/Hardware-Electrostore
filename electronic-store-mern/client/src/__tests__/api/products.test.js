import { getProducts, getProduct, getCategories } from '../../api/products';
import request from '../../api/request';

jest.mock('../../api/request');

describe('Products API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get products without params', async () => {
    request.mockResolvedValue({ success: true, data: [] });

    await getProducts();

    expect(request).toHaveBeenCalledWith('/products');
  });

  it('should get products with query params', async () => {
    request.mockResolvedValue({ success: true, data: [] });

    await getProducts({ category: 'Phones', sort: 'price-low' });

    expect(request).toHaveBeenCalledWith('/products?category=Phones&sort=price-low');
  });

  it('snapshot: getProducts call with params', async () => {
    request.mockResolvedValue({ success: true, data: [] });
    await getProducts({ category: 'Phones', sort: 'price-low', page: 2 });
    expect(request.mock.calls[0]).toMatchSnapshot();
  });

  it('should get single product by id', async () => {
    request.mockResolvedValue({ success: true, data: { name: 'Test' } });

    await getProduct('abc123');

    expect(request).toHaveBeenCalledWith('/products/abc123');
  });

  it('should get categories', async () => {
    request.mockResolvedValue({ success: true, data: ['All', 'Phones'] });

    await getCategories();

    expect(request).toHaveBeenCalledWith('/products/categories');
  });
});
