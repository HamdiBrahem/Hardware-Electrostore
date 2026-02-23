import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitize } from '../helpers/sanitize.js';
import Product from '../../models/Product.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Product Model', () => {
  const validProductData = {
    name: 'Test Laptop',
    category: 'Computers',
    price: 999.99,
    image: '/images/test.jpg',
  };

  it('should create a product successfully', async () => {
    const product = await Product.create(validProductData);
    expect(product.name).toBe('Test Laptop');
    expect(product.category).toBe('Computers');
    expect(product.price).toBe(999.99);
  });

  it('snapshot: created product shape', async () => {
    const product = await Product.create(validProductData);
    expect(sanitize(product.toJSON())).toMatchSnapshot();
  });

  it('snapshot: product with all fields', async () => {
    const product = await Product.create({
      ...validProductData,
      brand: 'TestBrand',
      rating: 4.5,
      reviews: 100,
      badge: 'Best Seller',
      description: 'A powerful laptop',
      features: ['SSD', '16GB RAM'],
      featured: true,
      countInStock: 25,
    });
    expect(sanitize(product.toJSON())).toMatchSnapshot();
  });

  it('should set default values', async () => {
    const product = await Product.create(validProductData);
    expect(product.brand).toBe('');
    expect(product.rating).toBe(0);
    expect(product.reviews).toBe(0);
    expect(product.badge).toBe('');
    expect(product.description).toBe('');
    expect(product.features).toEqual([]);
    expect(product.featured).toBe(false);
    expect(product.countInStock).toBe(10);
  });

  it('should require name', async () => {
    const { name, ...data } = validProductData;
    await expect(Product.create(data)).rejects.toThrow();
  });

  it('should require category', async () => {
    const { category, ...data } = validProductData;
    await expect(Product.create(data)).rejects.toThrow();
  });

  it('should require price', async () => {
    const { price, ...data } = validProductData;
    await expect(Product.create(data)).rejects.toThrow();
  });

  it('should require image', async () => {
    const { image, ...data } = validProductData;
    await expect(Product.create(data)).rejects.toThrow();
  });

  it('should enforce rating min 0 and max 5', async () => {
    await expect(
      Product.create({ ...validProductData, rating: -1 })
    ).rejects.toThrow();
    await expect(
      Product.create({ ...validProductData, rating: 6 })
    ).rejects.toThrow();
  });

  it('should accept valid rating between 0 and 5', async () => {
    const product = await Product.create({ ...validProductData, rating: 4.5 });
    expect(product.rating).toBe(4.5);
  });

  it('should store features as array of strings', async () => {
    const product = await Product.create({
      ...validProductData,
      features: ['SSD', '16GB RAM', 'RTX 4090'],
    });
    expect(product.features).toHaveLength(3);
    expect(product.features).toContain('SSD');
  });

  it('should include timestamps', async () => {
    const product = await Product.create(validProductData);
    expect(product.createdAt).toBeDefined();
    expect(product.updatedAt).toBeDefined();
  });
});
