const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { speciality, type, q } = req.query;
  let sql = 'SELECT * FROM hospitals WHERE 1=1';
  const params = [];
  if (speciality) { sql += ' AND LOWER(specialities) LIKE ?'; params.push(`%${speciality.toLowerCase()}%`); }
  if (type) { sql += ' AND LOWER(type) LIKE ?'; params.push(`%${type.toLowerCase()}%`); }
  if (q) { sql += ' AND (LOWER(name) LIKE ? OR LOWER(area) LIKE ? OR LOWER(specialities) LIKE ?)'; params.push(`%${q.toLowerCase()}%`,`%${q.toLowerCase()}%`,`%${q.toLowerCase()}%`); }
  sql += ' ORDER BY rating DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id', (req, res) => {
  const h = db.prepare('SELECT * FROM hospitals WHERE id = ?').get(req.params.id);
  if (!h) return res.status(404).json({ error: 'Hospital not found' });
  res.json(h);
});

module.exports = router;
