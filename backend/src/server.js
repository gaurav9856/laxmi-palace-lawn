require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const calendarRoutes = require('./routes/calendar');
const blockedDateRoutes = require('./routes/blockedDates');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:4200').split(','),
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limit for public-facing booking creation and admin login
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'laxmi-palace-api' }));

app.use('/api/bookings', publicLimiter, bookingRoutes);
app.use('/api/admin/login', authLimiter);
app.use('/api/admin', adminRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/blocked-dates', blockedDateRoutes);

app.use(notFound);
app.use(errorHandler);

(async () => {
  try {
    await testConnection();
    console.log('[db] connected to MySQL');
  } catch (e) {
    console.error('[db] failed to connect:', e.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
})();
