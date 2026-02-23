/**
 * Strip dynamic fields from a Mongoose document or API response
 * so that the snapshot stays stable across runs.
 */
export function sanitize(obj) {
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (!obj || typeof obj !== 'object') return obj;

  const copy = { ...obj };

  // Replace dynamic Mongo / Date fields with stable placeholders
  if (copy._id) copy._id = '[ObjectId]';
  if (copy.__v !== undefined) copy.__v = '[version]';
  if (copy.createdAt) copy.createdAt = '[Date]';
  if (copy.updatedAt) copy.updatedAt = '[Date]';
  if (copy.paidAt) copy.paidAt = '[Date]';
  if (copy.token) copy.token = '[JWT]';
  if (copy.password && copy.password.startsWith('$2a$')) copy.password = '[bcrypt]';

  // Recurse into nested objects
  for (const key of Object.keys(copy)) {
    if (Array.isArray(copy[key])) {
      copy[key] = copy[key].map(sanitize);
    } else if (copy[key] && typeof copy[key] === 'object') {
      copy[key] = sanitize(copy[key]);
    }
  }

  return copy;
}

/**
 * Sanitize an API response body for snapshot testing.
 * Handles { success, data, pagination } shapes.
 */
export function sanitizeResponse(body) {
  const copy = { ...body };
  if (copy.data) copy.data = sanitize(copy.data);
  if (copy.pagination) copy.pagination = { ...copy.pagination };
  return copy;
}
