import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitizeResponse } from '../helpers/sanitize.js';
import request from 'supertest';
import { createApp } from '../helpers/testApp.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import { generateToken } from '../../middleware/auth.js';

let app, adminToken, userToken;

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
  await Order.deleteMany({});
});

describe('Admin Routes', () => {
  // ─── GET /api/admin/stats ────────────────────────────────────
  describe('GET /api/admin/stats', () => {
    it('should return dashboard stats for admin', async () => {
      await Product.create({
        name: 'Product',
        category: 'Test',
        price: 100,
        image: '/test.jpg',
      });

      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.totalProducts).toBeGreaterThanOrEqual(1);
      expect(res.body.data.totalUsers).toBeGreaterThanOrEqual(2);
      expect(res.body.data.totalRevenue).toBeDefined();
      expect(res.body.data.statusCounts).toBeDefined();
      expect(res.body.data.recentOrders).toBeDefined();
    });

    it('snapshot: admin stats response shape', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 403 for non-admin', async () => {
      await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/admin/stats')
        .expect(401);
    });
  });

  // ─── GET /api/admin/users ────────────────────────────────────
  describe('GET /api/admin/users', () => {
    it('should return all users for admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
      // Should not include passwords
      res.body.data.forEach((user) => {
        expect(user.password).toBeUndefined();
      });
    });

    it('should return 403 for non-admin', async () => {
      await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
