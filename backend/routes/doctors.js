const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { speciality, area, q } = req.query;
  let sql = 'SELECT * FROM doctors WHERE 1=1';
  const params = [];
  if (speciality) { sql += ' AND LOWER(speciality) LIKE ?'; params.push(`%${speciality.toLowerCase()}%`); }
  if (area) { sql += ' AND LOWER(area) LIKE ?'; params.push(`%${area.toLowerCase()}%`); }
  if (q) { sql += ' AND (LOWER(name) LIKE ? OR LOWER(speciality) LIKE ? OR LOWER(hospital) LIKE ?)'; params.push(`%${q.toLowerCase()}%`,`%${q.toLowerCase()}%`,`%${q.toLowerCase()}%`); }
  sql += ' ORDER BY rating DESC, reviews DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/specialities', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT speciality FROM doctors ORDER BY speciality').all();
  res.json(rows.map(r => r.speciality));
});

router.get('/:id', (req, res) => {
  const doc = db.prepare('SELECT * FROM doctors WHERE id = ?').get(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doc);
});

module.exports = router;
