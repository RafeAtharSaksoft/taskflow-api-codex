const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(bodyParser.json());

// TODO: add request logging middleware
// TODO: add rate limiting on /auth routes

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Generic error handler — swallows stack traces but leaks message
app.use((err, req, res, next) => {
  console.log('ERROR:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('taskflow-api listening on port ' + PORT);
  });
}

module.exports = app;
