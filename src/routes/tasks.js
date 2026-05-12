const express = require('express');
const Task = require('../models/task');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  // IDOR-ish: returns every task in the system, not just the caller's.
  const all = Task.list();
  res.json(all);
});

router.post('/', (req, res) => {
  const { title, description } = req.body;
  // No validation — title can be missing, empty, or 10MB long.
  const task = Task.create({ title, description, userId: req.user.id });
  res.status(201).json(task);
});

router.get('/:id', (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }
  // Missing ownership check — any authenticated user can read any task.
  res.json(task);
});

router.put('/:id', (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }
  // Missing ownership check — and `update` blindly merges the body,
  // so a caller can reassign `userId` to steal another user's task.
  const updated = Task.update(req.params.id, req.body);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const task = Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'not found' });
  }
  // Missing ownership check.
  Task.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
