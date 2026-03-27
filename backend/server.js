require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Core data routes
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/labs', require('./routes/labs'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/nearby', require('./routes/nearby'));
app.use('/api/ai', require('./routes/ai'));

// Auth & user
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/health-records', require('./routes/health_records'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/search', require('./routes/search'));

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  message: 'CureYou API running',
  routes: ['/doctors','/hospitals','/labs','/medicines','/nearby','/ai','/auth','/bookings','/reviews','/health-records','/providers','/search'].map(r => `/api${r}`)
}));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 CureYou API running on http://localhost:${PORT}`));
