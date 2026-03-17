const { randomUUID } = require('crypto');

function generateId() {
  return randomUUID();
}

function sendJSON(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function success(res, statusCode, data, meta = {}) {
  sendJSON(res, statusCode, { success: true, ...meta, data });
}

function error(res, statusCode, message) {
  sendJSON(res, statusCode, { success: false, message });
}

module.exports = { generateId, sendJSON, success, error };
