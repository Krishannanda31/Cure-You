const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'cureyou-secret-key-2025';
const JWT_EXPIRES = '7d';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, dob, gender, area, blood_group } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const result = db.prepare(`
    INSERT INTO users (name, email, phone, password_hash, dob, gender, area, blood_group)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, email, phone || null, hash, dob || null, gender || null, area || null, blood_group || null);

  const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.status(201).json({ message: 'Account created successfully', token, user: { id: result.lastInsertRowid, name, email, phone, area } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  const { password_hash, ...safeUser } = user;
  res.json({ message: 'Login successful', token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, dob, gender, area, blood_group, pro_member, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PATCH /api/auth/me — update profile
router.patch('/me', auth, (req, res) => {
  const { name, phone, dob, gender, area, blood_group } = req.body;
  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      dob = COALESCE(?, dob),
      gender = COALESCE(?, gender),
      area = COALESCE(?, area),
      blood_group = COALESCE(?, blood_group)
    WHERE id = ?
  `).run(name, phone, dob, gender, area, blood_group, req.user.id);
  res.json({ message: 'Profile updated' });
});

module.exports = router;
