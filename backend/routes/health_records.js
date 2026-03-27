const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/health-records — add a record
router.post('/', auth, (req, res) => {
  const { record_type, title, test_name, lab_name, doctor_name, record_date, file_name, file_size, notes } = req.body;
  if (!record_type || !title) return res.status(400).json({ error: 'record_type and title required' });

  const result = db.prepare(`
    INSERT INTO health_records (user_id, record_type, title, test_name, lab_name, doctor_name, record_date, file_name, file_size, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, record_type, title, test_name||null, lab_name||null, doctor_name||null, record_date||null, file_name||null, file_size||null, notes||null);

  res.status(201).json({ message: 'Health record saved', id: result.lastInsertRowid });
});

// GET /api/health-records — list my records
router.get('/', auth, (req, res) => {
  const { type } = req.query;
  let sql = 'SELECT * FROM health_records WHERE user_id = ?';
  const params = [req.user.id];
  if (type) { sql += ' AND record_type = ?'; params.push(type); }
  sql += ' ORDER BY record_date DESC, created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

// GET /api/health-records/summary — quick stats for dashboard
router.get('/summary', auth, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM health_records WHERE user_id = ?').get(req.user.id).c;
  const byType = db.prepare('SELECT record_type, COUNT(*) as count FROM health_records WHERE user_id = ? GROUP BY record_type').all(req.user.id);
  const latest = db.prepare('SELECT * FROM health_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(req.user.id);
  res.json({ total, by_type: byType, latest });
});

// GET /api/health-records/:id
router.get('/:id', auth, (req, res) => {
  const r = db.prepare('SELECT * FROM health_records WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!r) return res.status(404).json({ error: 'Record not found' });
  res.json(r);
});

// DELETE /api/health-records/:id
router.delete('/:id', auth, (req, res) => {
  const r = db.prepare('SELECT id FROM health_records WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!r) return res.status(404).json({ error: 'Record not found' });
  db.prepare('DELETE FROM health_records WHERE id = ?').run(req.params.id);
  res.json({ message: 'Record deleted' });
});

module.exports = router;
