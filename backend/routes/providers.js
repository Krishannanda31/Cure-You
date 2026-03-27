const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/providers/register — provider self-registration
router.post('/register', (req, res) => {
  const { provider_type, name, contact_person, email, phone, address, area, registration_number, accreditation } = req.body;
  if (!provider_type || !name || !email || !phone) {
    return res.status(400).json({ error: 'provider_type, name, email, phone required' });
  }
  if (!['doctor','lab','hospital','pharmacy'].includes(provider_type)) {
    return res.status(400).json({ error: 'provider_type must be doctor, lab, hospital, or pharmacy' });
  }

  const existing = db.prepare('SELECT id FROM provider_registrations WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'This email is already registered' });

  const result = db.prepare(`
    INSERT INTO provider_registrations (provider_type, name, contact_person, email, phone, address, area, registration_number, accreditation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(provider_type, name, contact_person||null, email, phone, address||null, area||null, registration_number||null, accreditation||null);

  res.status(201).json({
    message: 'Registration submitted successfully! Our team will verify and activate your profile within 24 hours.',
    id: result.lastInsertRowid
  });
});

// GET /api/providers/status?email=... — check registration status
router.get('/status', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  const reg = db.prepare('SELECT id, provider_type, name, status, created_at FROM provider_registrations WHERE email = ?').get(email);
  if (!reg) return res.status(404).json({ error: 'No registration found for this email' });
  res.json(reg);
});

module.exports = router;
