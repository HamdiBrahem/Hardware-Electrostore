import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitizeResponse } from '../helpers/sanitize.js';
import request from 'supertest';
import { createApp } from '../helpers/testApp.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { generateToken } from '../../middleware/auth.js';

let app;
let adminToken;
let userToken;

beforeAll(async () => {
  await connectTestDB();
  process.env.JWT_SECRET = 'test-jwt-secret';
  app = createApp();

  const admin = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: 'password123',
    isAdmin: true,
  });
  adminToken = generateToken(admin._id);

  const user = await User.create({
    username: 'regularuser',
    email: 'user@test.com',
    password: 'password123',
  });
  userToken = generateToken(user._id);
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Product Routes', () => {
  const productData = {
    name: 'Test Laptop',
    category: 'Computers',
    price: 999.99,
    image: '/images/test.jpg',
    brand: 'TestBrand',
    description: 'A great laptop',
  };

  // ─── GET /api/products ───────────────────────────────────────
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      await Product.create(productData);
      await Product.create({ ...productData, name: 'Test Phone', category: 'Phones', price: 500 });

      const res = await request(app).get('/api/products').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
    });

    it('snapshot: product list response shape', async () => {
      await Product.create(productData);
      const res = await request(app).get('/api/products');
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should filter by category', async () => {
      await Product.create(productData);
      await Product.create({ ...productData, name: 'Test Phone', category: 'Phones' });

      const res = await request(app)
        .get('/api/products?category=Computers')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].category).toBe('Computers');
    });

    it('should search products by name', async () => {
      await Product.create(productData);
      await Product.create({ ...productData, name: 'Gaming Mouse', category: 'Accessories', description: 'A great mouse' });

      const res = await request(app)
        .get('/api/products?search=Laptop')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Test Laptop');
    });

    it('should filter by price range', async () => {
      await Product.create({ ...productData, price: 100 });
      await Product.create({ ...productData, name: 'Expensive', price: 2000 });

      const res = await request(app)
        .get('/api/products?minPrice=50&maxPrice=500')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
    });

    it('should sort by price ascending', async () => {
      await Product.create({ ...productData, name: 'Cheap', price: 100 });
      await Product.create({ ...productData, name: 'Expensive', price: 2000 });

      const res = await request(app)
        .get('/api/products?sort=price-low')
        .expect(200);

      expect(res.body.data[0].price).toBeLessThan(res.body.data[1].price);
    });

    it('should filter featured products', async () => {
      await Product.create({ ...productData, featured: true });
      await Product.create({ ...productData, name: 'Regular', featured: false });

      const res = await request(app)
        .get('/api/products?featured=true')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].featured).toBe(true);
    });

    it('should paginate results', async () => {
      for (let i = 0; i < 5; i++) {
        await Product.create({ ...productData, name: `Product ${i}` });
      }

      const res = await request(app)
        .get('/api/products?page=1&limit=2')
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination.total).toBe(5);
      expect(res.body.pagination.pages).toBe(3);
    });
  });

  // ─── GET /api/products/categories ────────────────────────────
  describe('GET /api/products/categories', () => {
    it('should return distinct categories with All', async () => {
      await Product.create(productData);
      await Product.create({ ...productData, name: 'Phone', category: 'Phones' });

      const res = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toContain('All');
      expect(res.body.data).toContain('Computers');
      expect(res.body.data).toContain('Phones');
    });
  });

  // ─── GET /api/products/:id ───────────────────────────────────
  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const product = await Product.create(productData);

      const res = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Laptop');
    });

    it('snapshot: single product response', async () => {
      const product = await Product.create(productData);
      const res = await request(app).get(`/api/products/${product._id}`);
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  // ─── POST /api/products (admin) ──────────────────────────────
  describe('POST /api/products', () => {
    it('should create product as admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Laptop');
    });

    it('snapshot: create product response', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 403 for non-admin user', async () => {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);
    });
  });

  // ─── PUT /api/products/:id (admin) ───────────────────────────
  describe('PUT /api/products/:id', () => {
    it('should update product as admin', async () => {
      const product = await Product.create(productData);

      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Laptop', price: 1299.99 })
        .expect(200);

      expect(res.body.data.name).toBe('Updated Laptop');
      expect(res.body.data.price).toBe(1299.99);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  // ─── DELETE /api/products/:id (admin) ────────────────────────
  describe('DELETE /api/products/:id', () => {
    it('should delete product as admin', async () => {
      const product = await Product.create(productData);

      const res = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      const found = await Product.findById(product._id);
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
