const express = require('express');
const router = express.Router();
const db = require('../db');

// Compare test prices across labs
router.get('/compare', (req, res) => {
  const { test, area } = req.query;
  if (!test) return res.status(400).json({ error: 'test param required' });

  let sql = `
    SELECT lt.price, lt.turnaround_hours, lt.test_name, lt.test_category,
           l.id as lab_id, l.name as lab_name, l.area, l.rating,
           l.nabl_certified, l.home_collection, l.phone
    FROM lab_tests lt
    JOIN labs l ON lt.lab_id = l.id
    WHERE LOWER(lt.test_name) LIKE ?
  `;
  const params = [`%${test.toLowerCase()}%`];
  if (area) { sql += ' AND LOWER(l.area) LIKE ?'; params.push(`%${area.toLowerCase()}%`); }
  sql += ' ORDER BY lt.price ASC';

  const results = db.prepare(sql).all(...params);
  res.json(results);
});

// List all unique test names
router.get('/tests', (req, res) => {
  const { q } = req.query;
  let sql = 'SELECT DISTINCT test_name, test_category FROM lab_tests';
  const params = [];
  if (q) { sql += ' WHERE LOWER(test_name) LIKE ?'; params.push(`%${q.toLowerCase()}%`); }
  sql += ' ORDER BY test_name';
  res.json(db.prepare(sql).all(...params));
});

// List all labs
router.get('/', (req, res) => {
  const { area, nabl } = req.query;
  let sql = 'SELECT * FROM labs WHERE 1=1';
  const params = [];
  if (area) { sql += ' AND LOWER(area) LIKE ?'; params.push(`%${area.toLowerCase()}%`); }
  if (nabl === '1') { sql += ' AND nabl_certified = 1'; }
  sql += ' ORDER BY rating DESC';
  res.json(db.prepare(sql).all(...params));
});

module.exports = router;
