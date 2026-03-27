const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/bookings — create a booking
router.post('/', auth, (req, res) => {
  const { booking_type, reference_id, reference_name, test_name, booking_date, booking_time, notes, amount } = req.body;
  if (!booking_type || !reference_id || !booking_date) {
    return res.status(400).json({ error: 'booking_type, reference_id, booking_date required' });
  }
  if (!['doctor', 'lab_test'].includes(booking_type)) {
    return res.status(400).json({ error: 'booking_type must be doctor or lab_test' });
  }

  const result = db.prepare(`
    INSERT INTO bookings (user_id, booking_type, reference_id, reference_name, test_name, booking_date, booking_time, notes, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, booking_type, reference_id, reference_name || null, test_name || null, booking_date, booking_time || null, notes || null, amount || null);

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message: 'Booking created', booking });
});

// GET /api/bookings — get my bookings
router.get('/', auth, (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM bookings WHERE user_id = ?';
  const params = [req.user.id];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY booking_date DESC, created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

// GET /api/bookings/:id
router.get('/:id', auth, (req, res) => {
  const b = db.prepare('SELECT * FROM bookings WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  res.json(b);
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', auth, (req, res) => {
  const b = db.prepare('SELECT * FROM bookings WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  if (b.status === 'completed') return res.status(400).json({ error: 'Cannot cancel a completed booking' });
  db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(req.params.id);
  res.json({ message: 'Booking cancelled' });
});

// GET /api/bookings/slots/:doctorId — available slots for a doctor
router.get('/slots/:doctorId', (req, res) => {
  const { date } = req.query;
  const allSlots = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

  if (!date) return res.json(allSlots.map(t => ({ time: t, available: true })));

  const booked = db.prepare(
    "SELECT booking_time FROM bookings WHERE reference_id = ? AND booking_type = 'doctor' AND booking_date = ? AND status NOT IN ('cancelled')"
  ).all(req.params.doctorId, date).map(r => r.booking_time);

  res.json(allSlots.map(t => ({ time: t, available: !booked.includes(t) })));
});

module.exports = router;
