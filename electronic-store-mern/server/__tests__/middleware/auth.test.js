import jwt from 'jsonwebtoken';
import { protect, admin, generateToken } from '../../middleware/auth.js';

// Mock User model
jest.mock('../../models/User.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

import User from '../../models/User.js';

const JWT_SECRET = 'test-jwt-secret';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ─── generateToken ───────────────────────────────────────────
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken('user123');
      const decoded = jwt.verify(token, JWT_SECRET);
      expect(decoded.id).toBe('user123');
    });

    it('should set expiry to 30 days', () => {
      const token = generateToken('user123');
      const decoded = jwt.verify(token, JWT_SECRET);
      const expectedExp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      // Allow 5 seconds tolerance
      expect(Math.abs(decoded.exp - expectedExp)).toBeLessThan(5);
    });
  });

  // ─── protect ─────────────────────────────────────────────────
  describe('protect', () => {
    it('should return 401 if no token provided', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Not authorized, no token' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('snapshot: 401 no-token response', async () => {
      await protect(req, res, next);
      expect(res.json.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should return 401 if Authorization header has no Bearer prefix', async () => {
      req.headers.authorization = 'Token abc123';
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Not authorized, token invalid' })
      );
    });

    it('snapshot: 401 invalid-token response', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      await protect(req, res, next);
      expect(res.json.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign({ id: 'nonexistent' }, JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;

      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'User not found' })
      );
    });

    it('should set req.user and call next() on valid token', async () => {
      const mockUser = { _id: 'user123', username: 'testuser', isAdmin: false };
      const token = jwt.sign({ id: 'user123' }, JWT_SECRET);
      req.headers.authorization = `Bearer ${token}`;

      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await protect(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  // ─── admin ───────────────────────────────────────────────────
  describe('admin', () => {
    it('should return 403 if user is not admin', () => {
      req.user = { isAdmin: false };
      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Not authorized as admin' })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('snapshot: 403 not-admin response', () => {
      req.user = { isAdmin: false };
      admin(req, res, next);
      expect(res.json.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should call next() if user is admin', () => {
      req.user = { isAdmin: true };
      admin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if no user on request', () => {
      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
