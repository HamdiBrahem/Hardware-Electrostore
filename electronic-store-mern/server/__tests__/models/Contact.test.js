import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitize } from '../helpers/sanitize.js';
import Contact from '../../models/Contact.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Contact Model', () => {
  const validContactData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message.',
  };

  it('should create a contact message successfully', async () => {
    const contact = await Contact.create(validContactData);
    expect(contact.name).toBe('John Doe');
    expect(contact.email).toBe('john@example.com');
    expect(contact.subject).toBe('Test Subject');
    expect(contact.message).toBe('This is a test message.');
  });

  it('snapshot: created contact shape', async () => {
    const contact = await Contact.create(validContactData);
    expect(sanitize(contact.toJSON())).toMatchSnapshot();
  });

  it('should set isRead to false by default', async () => {
    const contact = await Contact.create(validContactData);
    expect(contact.isRead).toBe(false);
  });

  it('should require name', async () => {
    const { name, ...data } = validContactData;
    await expect(Contact.create(data)).rejects.toThrow();
  });

  it('should require email', async () => {
    const { email, ...data } = validContactData;
    await expect(Contact.create(data)).rejects.toThrow();
  });

  it('should require subject', async () => {
    const { subject, ...data } = validContactData;
    await expect(Contact.create(data)).rejects.toThrow();
  });

  it('should require message', async () => {
    const { message, ...data } = validContactData;
    await expect(Contact.create(data)).rejects.toThrow();
  });

  it('should include timestamps', async () => {
    const contact = await Contact.create(validContactData);
    expect(contact.createdAt).toBeDefined();
    expect(contact.updatedAt).toBeDefined();
  });
});
