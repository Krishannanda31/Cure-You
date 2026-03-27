const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/reviews — submit a review
router.post('/', auth, (req, res) => {
  const { review_type, reference_id, rating, title, body } = req.body;
  if (!review_type || !reference_id || !rating) {
    return res.status(400).json({ error: 'review_type, reference_id, rating required' });
  }
  if (!['doctor', 'lab', 'hospital'].includes(review_type)) {
    return res.status(400).json({ error: 'review_type must be doctor, lab, or hospital' });
  }
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  // Check for duplicate review
  const dup = db.prepare('SELECT id FROM reviews WHERE user_id = ? AND review_type = ? AND reference_id = ?').get(req.user.id, review_type, reference_id);
  if (dup) return res.status(409).json({ error: 'You have already reviewed this.' });

  // Check if user has a completed booking for this provider (verified visit)
  const verified = db.prepare(
    "SELECT id FROM bookings WHERE user_id = ? AND reference_id = ? AND status = 'completed'"
  ).get(req.user.id, reference_id);

  const result = db.prepare(`
    INSERT INTO reviews (user_id, user_name, review_type, reference_id, rating, title, body, verified_visit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, req.user.name, review_type, reference_id, rating, title || null, body || null, verified ? 1 : 0);

  res.status(201).json({ message: 'Review submitted', id: result.lastInsertRowid });
});

// GET /api/reviews?type=doctor&id=1
router.get('/', (req, res) => {
  const { type, id } = req.query;
  if (!type || !id) return res.status(400).json({ error: 'type and id required' });

  const reviews = db.prepare(`
    SELECT r.*, u.area as user_area
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.review_type = ? AND r.reference_id = ?
    ORDER BY r.created_at DESC
  `).all(type, id);

  const stats = db.prepare(`
    SELECT AVG(rating) as avg_rating, COUNT(*) as total,
      SUM(CASE WHEN rating=5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating=4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating=3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating=2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating=1 THEN 1 ELSE 0 END) as one_star
    FROM reviews WHERE review_type = ? AND reference_id = ?
  `).get(type, id);

  res.json({ reviews, stats });
});

// GET /api/reviews/my — my reviews
router.get('/my', auth, (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(reviews);
});

module.exports = router;
