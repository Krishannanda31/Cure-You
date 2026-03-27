const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/search?q=... — unified search across all modules
router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ error: 'q must be at least 2 characters' });

  const term = `%${q.toLowerCase()}%`;

  const doctors = db.prepare(`
    SELECT id, name, speciality, area, fee, rating, hospital, 'doctor' as category
    FROM doctors WHERE LOWER(name) LIKE ? OR LOWER(speciality) LIKE ? OR LOWER(hospital) LIKE ?
    LIMIT 5
  `).all(term, term, term);

  const hospitals = db.prepare(`
    SELECT id, name, area, type, rating, 'hospital' as category
    FROM hospitals WHERE LOWER(name) LIKE ? OR LOWER(specialities) LIKE ?
    LIMIT 5
  `).all(term, term);

  const tests = db.prepare(`
    SELECT DISTINCT lt.test_name, lt.test_category,
      MIN(lt.price) as min_price, MAX(lt.price) as max_price, COUNT(*) as lab_count,
      'test' as category
    FROM lab_tests lt WHERE LOWER(lt.test_name) LIKE ?
    GROUP BY lt.test_name LIMIT 5
  `).all(term);

  const medicines = db.prepare(`
    SELECT id, brand_name, generic_name, brand_price, generic_price, category, 'medicine' as type
    FROM medicines WHERE LOWER(brand_name) LIKE ? OR LOWER(generic_name) LIKE ?
    LIMIT 5
  `).all(term, term);

  const total = doctors.length + hospitals.length + tests.length + medicines.length;
  res.json({ query: q, total, doctors, hospitals, tests, medicines });
});

module.exports = router;
