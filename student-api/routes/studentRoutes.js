const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { error } = require('../utils/helpers');

/**
 * Parse the request body as JSON.
 * Resolves with parsed object, or rejects with an error message string.
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject('Request body is not valid JSON');
      }
    });
    req.on('error', () => reject('Failed to read request body'));
  });
}

/**
 * Parse query string into a plain object.
 */
function parseQuery(url) {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  const qs = url.slice(idx + 1);
  const params = {};
  for (const pair of qs.split('&')) {
    const [k, v] = pair.split('=');
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
  }
  return params;
}

/**
 * Main router – matches method + path and calls the right controller.
 */
async function router(req, res) {
  const method = req.method.toUpperCase();
  const rawUrl = req.url || '/';
  const pathOnly = rawUrl.split('?')[0].replace(/\/$/, '') || '/';
  const query = parseQuery(rawUrl);

  // ── Route: /students ────────────────────────────────────────────────────────
  if (pathOnly === '/students') {
    if (method === 'GET') {
      return getAllStudents(req, res, query);
    }

    if (method === 'POST') {
      let body;
      try {
        body = await parseBody(req);
      } catch (msg) {
        return error(res, 400, msg);
      }
      return createStudent(req, res, body);
    }

    return error(res, 405, `Method ${method} not allowed on /students`);
  }

  // ── Route: /students/:id ────────────────────────────────────────────────────
  const match = pathOnly.match(/^\/students\/([^/]+)$/);
  if (match) {
    const id = decodeURIComponent(match[1]);

    if (method === 'GET') {
      return getStudentById(req, res, id);
    }

    if (method === 'PUT') {
      let body;
      try {
        body = await parseBody(req);
      } catch (msg) {
        return error(res, 400, msg);
      }
      return updateStudent(req, res, id, body);
    }

    if (method === 'DELETE') {
      return deleteStudent(req, res, id);
    }

    return error(res, 405, `Method ${method} not allowed on /students/:id`);
  }

  // ── 404 catch-all ───────────────────────────────────────────────────────────
  error(res, 404, `Route ${method} ${pathOnly} not found`);
}

module.exports = router;
