const studentModel = require('../models/studentModel');
const { validateStudent } = require('../middleware/validate');
const { success, error } = require('../utils/helpers');

// ── GET /students ─────────────────────────────────────────────────────────────

function getAllStudents(req, res, query) {
  const { year, page, limit } = query;

  // Validate year filter if provided
  if (year !== undefined) {
    const y = Number(year);
    if (!Number.isInteger(y) || y < 1 || y > 4) {
      return error(res, 400, 'Query param year must be an integer between 1 and 4');
    }
  }

  const result = studentModel.getAll({ year, page, limit });

  const { data, total, ...pagination } = result;
  const meta =
    page !== undefined || limit !== undefined
      ? { total, ...pagination }
      : { total };

  success(res, 200, data, meta);
}

// ── GET /students/:id ─────────────────────────────────────────────────────────

function getStudentById(req, res, id) {
  const student = studentModel.getById(id);
  if (!student) {
    return error(res, 404, `Student with id '${id}' not found`);
  }
  success(res, 200, student);
}

// ── POST /students ────────────────────────────────────────────────────────────

function createStudent(req, res, body) {
  const validation = validateStudent(body, true);
  if (!validation.valid) {
    return error(res, 400, validation.message);
  }

  const student = studentModel.create(body);
  success(res, 201, student);
}

// ── PUT /students/:id ─────────────────────────────────────────────────────────

function updateStudent(req, res, id, body) {
  // At least one updatable field must be present
  const updatable = ['name', 'email', 'course', 'year'];
  const hasField = updatable.some((f) => body[f] !== undefined);
  if (!hasField) {
    return error(
      res,
      400,
      `Request body must contain at least one of: ${updatable.join(', ')}`
    );
  }

  // Validate only the fields that are present (partial update)
  const validation = validateStudent(body, false);
  if (!validation.valid) {
    return error(res, 400, validation.message);
  }

  const student = studentModel.update(id, body);
  if (!student) {
    return error(res, 404, `Student with id '${id}' not found`);
  }
  success(res, 200, student);
}

// ── DELETE /students/:id ──────────────────────────────────────────────────────

function deleteStudent(req, res, id) {
  const deleted = studentModel.remove(id);
  if (!deleted) {
    return error(res, 404, `Student with id '${id}' not found`);
  }
  success(res, 200, null, { message: 'Student deleted successfully' });
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
