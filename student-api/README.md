# 🎓 College Student Management REST API

A fully-featured RESTful API built with **Node.js's built-in `http` module** — zero external frameworks.

## Features
- ✅ Full CRUD for students
- ✅ JSON file persistence (`data/students.json`)
- ✅ Input validation with descriptive error messages
- ✅ Proper HTTP status codes
- ✅ MVC folder structure
- ✅ Pagination (`?page=1&limit=5`)
- ✅ Query filtering (`?year=3`)
- ✅ `createdAt` / `updatedAt` timestamps
- ✅ Structured error & success responses

---

## Project Structure

```
student-api/
├── server.js                  # Entry point – creates HTTP server
├── routes/
│   └── studentRoutes.js       # URL parsing & method dispatching
├── controllers/
│   └── studentController.js   # Business logic / route handlers
├── models/
│   └── studentModel.js        # In-memory store + JSON file persistence
├── middleware/
│   └── validate.js            # Validation rules
├── utils/
│   └── helpers.js             # ID generation, response helpers
└── data/
    └── students.json          # Persistent data store
```

---

## Getting Started

```bash
# Install (no external dependencies!)
git clone <repo-url>
cd student-api

# Start the server
node server.js
# or with auto-restart (Node 18+)
node --watch server.js
```

Server runs at: `http://localhost:3000`

---

## API Reference

### Student Data Model

```json
{
  "id": "uuid-v4",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "course": "Computer Science",
  "year": 2,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

---

### POST `/students` – Create a student

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "course": "Computer Science",
  "year": 2
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "Jane Doe", ... }
}
```

---

### GET `/students` – List all students

Supports optional query params:

| Param   | Description                  | Example          |
|---------|------------------------------|------------------|
| `year`  | Filter by year (1–4)         | `?year=3`        |
| `page`  | Page number (default: 1)     | `?page=2`        |
| `limit` | Items per page (default: 5)  | `?limit=10`      |

**Response `200`:**
```json
{
  "success": true,
  "total": 12,
  "page": 1,
  "limit": 5,
  "totalPages": 3,
  "data": [ ... ]
}
```

---

### GET `/students/:id` – Get one student

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "...", ... }
}
```

**Response `404`:**
```json
{
  "success": false,
  "message": "Student with id '...' not found"
}
```

---

### PUT `/students/:id` – Update a student (partial update supported)

**Request Body** (any subset of fields):
```json
{
  "year": 3,
  "course": "Data Science"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "id": "...", "year": 3, "updatedAt": "...", ... }
}
```

---

### DELETE `/students/:id` – Delete a student

**Response `200`:**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": null
}
```

---

## Validation Rules

| Field    | Rule                                         |
|----------|----------------------------------------------|
| `name`   | Required, non-empty string                   |
| `email`  | Required, valid email format                 |
| `course` | Required, non-empty string                   |
| `year`   | Required, integer between 1 and 4 (inclusive)|
| `id`     | Server-generated UUID (not accepted from client) |

**Validation error response `400`:**
```json
{
  "success": false,
  "message": "Missing required field(s): email, year"
}
```

---

## HTTP Status Codes Used

| Code | Meaning                    |
|------|----------------------------|
| 200  | OK                         |
| 201  | Created                    |
| 400  | Bad Request (validation)   |
| 404  | Not Found                  |
| 405  | Method Not Allowed         |
| 500  | Internal Server Error      |

---

## Example cURL Commands

```bash
# Create a student
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@uni.edu","course":"CS","year":1}'

# List all students
curl http://localhost:3000/students

# Filter by year
curl "http://localhost:3000/students?year=2"

# Paginate
curl "http://localhost:3000/students?page=1&limit=3"

# Get by ID
curl http://localhost:3000/students/<id>

# Update
curl -X PUT http://localhost:3000/students/<id> \
  -H "Content-Type: application/json" \
  -d '{"year":3}'

# Delete
curl -X DELETE http://localhost:3000/students/<id>
```
