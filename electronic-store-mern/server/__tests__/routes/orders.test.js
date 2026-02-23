import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitizeResponse } from '../helpers/sanitize.js';
import request from 'supertest';
import { createApp } from '../helpers/testApp.js';
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import User from '../../models/User.js';
import { generateToken } from '../../middleware/auth.js';

let app, adminToken, userToken, userId, adminId, product;

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
  adminId = admin._id;
  adminToken = generateToken(admin._id);

  const user = await User.create({
    username: 'regularuser',
    email: 'user@test.com',
    password: 'password123',
  });
  userId = user._id;
  userToken = generateToken(user._id);

  product = await Product.create({
    name: 'Test Product',
    category: 'Test',
    price: 99.99,
    image: '/images/test.jpg',
  });
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await Order.deleteMany({});
});

describe('Order Routes', () => {
  const getOrderData = (productId) => ({
    items: [
      {
        product: productId,
        name: 'Test Product',
        image: '/images/test.jpg',
        price: 99.99,
        quantity: 2,
      },
    ],
    shippingAddress: {
      address: '123 Test St',
      city: 'TestCity',
      postalCode: '12345',
      country: 'US',
    },
    totalPrice: 199.98,
  });

  // ─── POST /api/orders ────────────────────────────────────────
  describe('POST /api/orders', () => {
    it('should create an order for authenticated user', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(getOrderData(product._id))
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalPrice).toBe(199.98);
      expect(res.body.data.status).toBe('pending');
    });

    it('snapshot: create order response', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(getOrderData(product._id));
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 400 for empty items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ...getOrderData(product._id), items: [] })
        .expect(400);

      expect(res.body.message).toBe('No order items');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/orders')
        .send(getOrderData(product._id))
        .expect(401);
    });
  });

  // ─── GET /api/orders/mine ────────────────────────────────────
  describe('GET /api/orders/mine', () => {
    it('should return only the logged-in user orders', async () => {
      await Order.create({ ...getOrderData(product._id), user: userId });
      await Order.create({ ...getOrderData(product._id), user: adminId });

      const res = await request(app)
        .get('/api/orders/mine')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  // ─── GET /api/orders/:id ────────────────────────────────────
  describe('GET /api/orders/:id', () => {
    it('should return order for the owner', async () => {
      const order = await Order.create({ ...getOrderData(product._id), user: userId });

      const res = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(order._id.toString());
    });

    it('should return 403 for non-owner non-admin', async () => {
      const order = await Order.create({ ...getOrderData(product._id), user: adminId });

      await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/orders/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  // ─── GET /api/orders/admin/all ───────────────────────────────
  describe('GET /api/orders/admin/all', () => {
    it('should return all orders for admin', async () => {
      await Order.create({ ...getOrderData(product._id), user: userId });
      await Order.create({ ...getOrderData(product._id), user: adminId });

      const res = await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(2);
    });

    it('should return 403 for non-admin', async () => {
      await request(app)
        .get('/api/orders/admin/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  // ─── PUT /api/orders/:id/status ──────────────────────────────
  describe('PUT /api/orders/:id/status', () => {
    it('should update order status as admin', async () => {
      const order = await Order.create({ ...getOrderData(product._id), user: userId });

      const res = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'shipped' })
        .expect(200);

      expect(res.body.data.status).toBe('shipped');
    });

    it('should set isPaid and paidAt when status is delivered', async () => {
      const order = await Order.create({ ...getOrderData(product._id), user: userId });

      const res = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'delivered' })
        .expect(200);

      expect(res.body.data.isPaid).toBe(true);
      expect(res.body.data.paidAt).toBeDefined();
    });

    it('should return 400 for invalid status', async () => {
      const order = await Order.create({ ...getOrderData(product._id), user: userId });

      await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid' })
        .expect(400);
    });

    it('should return 403 for non-admin', async () => {
      const order = await Order.create({ ...getOrderData(product._id), user: userId });

      await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'shipped' })
        .expect(403);
    });
  });
});
