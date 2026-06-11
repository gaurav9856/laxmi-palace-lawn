require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const calendarRoutes = require('./routes/calendar');
const blockedDateRoutes = require('./routes/blockedDates');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1); // needed when behind Vercel / reverse proxy
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                  // same-origin / curl
    if (allowedOrigins.includes('*')) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 60,
  standardHeaders: true, legacyHeaders: false
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false
});

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', service: 'laxmi-palace-api', env: process.env.NODE_ENV || 'dev' }));

app.use('/api/bookings', publicLimiter, bookingRoutes);
app.use('/api/admin/login', authLimiter);
app.use('/api/admin', adminRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/blocked-dates', blockedDateRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
