const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate student fields.
 * @param {object} data
 * @param {boolean} requireAll – true for POST, false for PUT (partial ok)
 * @returns {{ valid: boolean, message?: string }}
 */
function validateStudent(data, requireAll = true) {
  const { name, email, course, year } = data;

  if (requireAll) {
    const missing = ['name', 'email', 'course', 'year'].filter(
      (f) => data[f] === undefined || data[f] === null || data[f] === ''
    );
    if (missing.length > 0) {
      return {
        valid: false,
        message: `Missing required field(s): ${missing.join(', ')}`,
      };
    }
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return { valid: false, message: 'name must be a non-empty string' };
    }
  }

  if (email !== undefined) {
    if (!EMAIL_RE.test(String(email).trim())) {
      return { valid: false, message: 'email must be a valid email address' };
    }
  }

  if (course !== undefined) {
    if (typeof course !== 'string' || course.trim().length === 0) {
      return { valid: false, message: 'course must be a non-empty string' };
    }
  }

  if (year !== undefined) {
    const y = Number(year);
    if (!Number.isInteger(y) || y < 1 || y > 4) {
      return { valid: false, message: 'year must be an integer between 1 and 4' };
    }
  }

  return { valid: true };
}

module.exports = { validateStudent };
