const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { type } = req.query;
  let sql = 'SELECT * FROM emergency_services WHERE 1=1';
  const params = [];
  if (type) { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY distance_km ASC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/types', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT type FROM emergency_services').all();
  res.json(rows.map(r => r.type));
});

module.exports = router;
