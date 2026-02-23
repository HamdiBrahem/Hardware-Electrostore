import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitizeResponse } from '../helpers/sanitize.js';
import request from 'supertest';
import { createApp } from '../helpers/testApp.js';
import User from '../../models/User.js';

let app;

beforeAll(async () => {
  await connectTestDB();
  process.env.JWT_SECRET = 'test-jwt-secret';
  app = createApp();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Auth Routes', () => {
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
  };

  // ─── POST /api/auth/register ─────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('testuser');
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('snapshot: register success response', async () => {
      const res = await request(app).post('/api/auth/register').send(userData);
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 400 for duplicate email', async () => {
      await User.create(userData);
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, email: 'invalid-email' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 400 for short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, password: '123' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 400 for short username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, username: 'ab' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // ─── POST /api/auth/login ────────────────────────────────────
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(userData);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('snapshot: login success response', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // ─── GET /api/auth/profile ───────────────────────────────────
  describe('GET /api/auth/profile', () => {
    it('should return user profile when authenticated', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('testuser');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  // ─── PUT /api/auth/profile ───────────────────────────────────
  describe('PUT /api/auth/profile', () => {
    it('should update user profile', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const token = registerRes.body.data.token;

      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated', lastName: 'Name' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe('Updated');
      expect(res.body.data.user.lastName).toBe('Name');
    });

    it('snapshot: profile update response', async () => {
      const registerRes = await request(app).post('/api/auth/register').send(userData);
      const token = registerRes.body.data.token;
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Updated', lastName: 'Name' });
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });
  });
});
