import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitize } from '../helpers/sanitize.js';
import Order from '../../models/Order.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Order Model', () => {
  const validOrderData = {
    user: new mongoose.Types.ObjectId(),
    items: [
      {
        product: new mongoose.Types.ObjectId(),
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
  };

  it('should create an order successfully', async () => {
    const order = await Order.create(validOrderData);
    expect(order.totalPrice).toBe(199.98);
    expect(order.items).toHaveLength(1);
    expect(order.shippingAddress.city).toBe('TestCity');
  });

  it('snapshot: created order shape', async () => {
    const order = await Order.create(validOrderData);
    const json = order.toJSON();
    json.user = '[ObjectId]';
    json.items = json.items.map(i => ({ ...i, _id: '[ObjectId]', product: '[ObjectId]' }));
    expect(sanitize(json)).toMatchSnapshot();
  });

  it('should set default status to pending', async () => {
    const order = await Order.create(validOrderData);
    expect(order.status).toBe('pending');
  });

  it('should set default isPaid to false', async () => {
    const order = await Order.create(validOrderData);
    expect(order.isPaid).toBe(false);
  });

  it('should only accept valid status values', async () => {
    await expect(
      Order.create({ ...validOrderData, status: 'invalid-status' })
    ).rejects.toThrow();
  });

  it('should accept all valid status values', async () => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    for (const status of statuses) {
      const order = await Order.create({ ...validOrderData, status });
      expect(order.status).toBe(status);
    }
  });

  it('should require user', async () => {
    const { user, ...data } = validOrderData;
    await expect(Order.create(data)).rejects.toThrow();
  });

  it('should require shipping address fields', async () => {
    await expect(
      Order.create({ ...validOrderData, shippingAddress: { address: '123 St' } })
    ).rejects.toThrow();
  });

  it('should require totalPrice', async () => {
    const { totalPrice, ...data } = validOrderData;
    await expect(Order.create(data)).rejects.toThrow();
  });

  it('should enforce minimum quantity of 1', async () => {
    const data = {
      ...validOrderData,
      items: [{ ...validOrderData.items[0], quantity: 0 }],
    };
    await expect(Order.create(data)).rejects.toThrow();
  });

  it('should include timestamps', async () => {
    const order = await Order.create(validOrderData);
    expect(order.createdAt).toBeDefined();
    expect(order.updatedAt).toBeDefined();
  });
});
