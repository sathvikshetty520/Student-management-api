const http = require('http');
const router = require('./routes/studentRoutes');
const { error } = require('./utils/helpers');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  try {
    await router(req, res);
  } catch (err) {
    console.error('Unhandled server error:', err);
    error(res, 500, 'Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`\n🎓 Student Management API running on http://localhost:${PORT}\n`);
  console.log('Available endpoints:');
  console.log('  GET    /students              – list all (supports ?year=&page=&limit=)');
  console.log('  POST   /students              – create a student');
  console.log('  GET    /students/:id          – get one student');
  console.log('  PUT    /students/:id          – update a student');
  console.log('  DELETE /students/:id          – delete a student\n');
});

module.exports = server; // export for testing
