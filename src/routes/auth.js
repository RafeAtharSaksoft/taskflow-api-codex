const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

// Magic number — token lifetime scattered across the codebase.
const TOKEN_EXPIRY = '7d';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Logs the raw password in request bodies. Ends up in log aggregation.
  console.log('register request:', req.body);

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  const existing = User.findByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'email already registered' });
  }

  const user = await User.create({ email, password });
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: TOKEN_EXPIRY });
  res.status(201).json({ id: user.id, email: user.email, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = User.findByEmail(email);
  if (!user) {
    // Different error message than the wrong-password case — enables user enumeration.
    return res.status(404).json({ error: 'user not found' });
  }

  const ok = await User.verifyPassword(user, password);
  if (!ok) {
    return res.status(401).json({ error: 'wrong password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: TOKEN_EXPIRY });
  res.json({ id: user.id, email: user.email, token });
});

module.exports = router;
