import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitizeResponse } from '../helpers/sanitize.js';
import request from 'supertest';
import { createApp } from '../helpers/testApp.js';
import Contact from '../../models/Contact.js';

let app;

beforeAll(async () => {
  await connectTestDB();
  app = createApp();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Contact Routes', () => {
  const contactData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message with at least 10 characters.',
  };

  describe('POST /api/contact', () => {
    it('should submit a contact message', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('snapshot: contact submit response', async () => {
      const res = await request(app).post('/api/contact').send(contactData);
      expect(sanitizeResponse(res.body)).toMatchSnapshot();
    });

    it('should return 400 for missing name', async () => {
      const { name, ...data } = contactData;
      await request(app)
        .post('/api/contact')
        .send(data)
        .expect(400);
    });

    it('should return 400 for invalid email', async () => {
      await request(app)
        .post('/api/contact')
        .send({ ...contactData, email: 'invalid-email' })
        .expect(400);
    });

    it('should return 400 for missing subject', async () => {
      const { subject, ...data } = contactData;
      await request(app)
        .post('/api/contact')
        .send(data)
        .expect(400);
    });

    it('should return 400 for short message', async () => {
      await request(app)
        .post('/api/contact')
        .send({ ...contactData, message: 'short' })
        .expect(400);
    });
  });
});
