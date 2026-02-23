import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/testDb.js';
import { sanitize } from '../helpers/sanitize.js';
import User from '../../models/User.js';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('User Model', () => {
  const validUserData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  it('should create a user successfully', async () => {
    const user = await User.create(validUserData);
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.isAdmin).toBe(false);
    expect(user.firstName).toBe('');
    expect(user.lastName).toBe('');
  });

  it('snapshot: created user shape', async () => {
    const user = await User.create(validUserData);
    expect(sanitize(user.toJSON())).toMatchSnapshot();
  });

  it('should hash password before saving', async () => {
    const user = await User.create(validUserData);
    expect(user.password).not.toBe('password123');
    expect(user.password.startsWith('$2a$')).toBe(true);
  });

  it('should not rehash password on non-password update', async () => {
    const user = await User.create(validUserData);
    const hashedPassword = user.password;

    user.firstName = 'John';
    await user.save();

    expect(user.password).toBe(hashedPassword);
  });

  it('should compare passwords correctly', async () => {
    const user = await User.create(validUserData);
    const isMatch = await user.comparePassword('password123');
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should remove password from JSON output', async () => {
    const user = await User.create(validUserData);
    const json = user.toJSON();
    expect(json.password).toBeUndefined();
    expect(json.username).toBe('testuser');
  });

  it('should require username', async () => {
    await expect(
      User.create({ email: 'a@b.com', password: '123456' })
    ).rejects.toThrow();
  });

  it('should require email', async () => {
    await expect(
      User.create({ username: 'testuser', password: '123456' })
    ).rejects.toThrow();
  });

  it('should require password', async () => {
    await expect(
      User.create({ username: 'testuser', email: 'a@b.com' })
    ).rejects.toThrow();
  });

  it('should enforce minimum password length of 6', async () => {
    await expect(
      User.create({ username: 'testuser', email: 'a@b.com', password: '12345' })
    ).rejects.toThrow();
  });

  it('should enforce minimum username length of 3', async () => {
    await expect(
      User.create({ username: 'ab', email: 'a@b.com', password: '123456' })
    ).rejects.toThrow();
  });

  it('should enforce unique username', async () => {
    await User.create(validUserData);
    await expect(
      User.create({ ...validUserData, email: 'other@example.com' })
    ).rejects.toThrow();
  });

  it('should enforce unique email', async () => {
    await User.create(validUserData);
    await expect(
      User.create({ ...validUserData, username: 'otheruser' })
    ).rejects.toThrow();
  });

  it('should convert email to lowercase', async () => {
    const user = await User.create({
      ...validUserData,
      email: 'TEST@EXAMPLE.COM',
    });
    expect(user.email).toBe('test@example.com');
  });

  it('should include timestamps', async () => {
    const user = await User.create(validUserData);
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});
