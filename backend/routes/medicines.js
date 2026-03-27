const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { q, category } = req.query;
  let sql = 'SELECT * FROM medicines WHERE 1=1';
  const params = [];
  if (q) { sql += ' AND (LOWER(brand_name) LIKE ? OR LOWER(generic_name) LIKE ?)'; params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`); }
  if (category) { sql += ' AND LOWER(category) LIKE ?'; params.push(`%${category.toLowerCase()}%`); }
  sql += ' ORDER BY brand_name ASC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM medicines ORDER BY category').all();
  res.json(rows.map(r => r.category));
});

router.get('/:id', (req, res) => {
  const med = db.prepare('SELECT * FROM medicines WHERE id = ?').get(req.params.id);
  // Find substitutes (same generic, different brand)
  const subs = med ? db.prepare('SELECT * FROM medicines WHERE generic_name = ? AND id != ? ORDER BY brand_price ASC').all(med.generic_name, med.id) : [];
  if (!med) return res.status(404).json({ error: 'Medicine not found' });
  res.json({ ...med, substitutes: subs });
});

module.exports = router;
