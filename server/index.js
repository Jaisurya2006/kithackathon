require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');
const { retryScheduledDonations } = require('./controllers/donationController');

const authRoutes     = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const userRoutes     = require('./routes/users');
const ngoRoutes      = require('./routes/ngos');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/ngos',      ngoRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🌱 Leftovers to Life API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // ── Cron: re-activate scheduled donations every hour (Step 6) ──
  retryScheduledDonations(); // run once on startup
  setInterval(retryScheduledDonations, 60 * 60 * 1000); // then every 60 min
  console.log('⏰ Scheduled donation retry cron started (every 60 min)');
});
