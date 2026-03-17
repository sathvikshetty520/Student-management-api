const fs = require('fs');
const path = require('path');
const { generateId } = require('../utils/helpers');

const DATA_FILE = path.join(__dirname, '../data/students.json');

// ── helpers ──────────────────────────────────────────────────────────────────

function readFromFile() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeToFile(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf8');
}

// ── in-memory cache (populated from file on startup) ─────────────────────────

let students = readFromFile();

// ── CRUD operations ───────────────────────────────────────────────────────────

function getAll({ year, page, limit } = {}) {
  let result = [...students];

  // Filter by year
  if (year !== undefined) {
    const y = parseInt(year, 10);
    result = result.filter((s) => s.year === y);
  }

  const total = result.length;

  // Pagination
  if (page !== undefined || limit !== undefined) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 5);
    const start = (p - 1) * l;
    result = result.slice(start, start + l);
    return {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
      data: result,
    };
  }

  return { total, data: result };
}

function getById(id) {
  return students.find((s) => s.id === id) || null;
}

function create(data) {
  const now = new Date().toISOString();
  const student = {
    id: generateId(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    course: data.course.trim(),
    year: Number(data.year),
    createdAt: now,
    updatedAt: now,
  };
  students.push(student);
  writeToFile(students);
  return student;
}

function update(id, data) {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = students[index];
  const updated = {
    ...existing,
    name: data.name !== undefined ? data.name.trim() : existing.name,
    email:
      data.email !== undefined
        ? data.email.trim().toLowerCase()
        : existing.email,
    course: data.course !== undefined ? data.course.trim() : existing.course,
    year: data.year !== undefined ? Number(data.year) : existing.year,
    updatedAt: new Date().toISOString(),
  };

  students[index] = updated;
  writeToFile(students);
  return updated;
}

function remove(id) {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  writeToFile(students);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
