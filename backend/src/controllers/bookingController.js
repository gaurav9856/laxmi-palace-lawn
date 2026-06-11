const { validationResult } = require('express-validator');
const { pool } = require('../config/database');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const BlockedDate = require('../models/BlockedDate');

function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    return false;
  }
  return true;
}

exports.create = async (req, res, next) => {
  if (!validate(req, res)) return;
  const { name, mobile, email, eventDate, eventType, guestCount, notes } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [blocked] = await conn.query(
      'SELECT id FROM blocked_dates WHERE blocked_date = ? LIMIT 1',
      [eventDate]
    );
    if (blocked.length) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: 'This date is blocked and not available for booking.'
      });
    }

    const [approved] = await conn.query(
      `SELECT id FROM bookings WHERE event_date = ? AND status = 'APPROVED' LIMIT 1`,
      [eventDate]
    );
    if (approved.length) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: 'Laxmi Palace Lawn is already booked on this date'
      });
    }

    const customerId = await Customer.upsert({ name, mobile, email }, conn);
    const bookingId = await Booking.create(
      { customerId, eventDate, eventType, guestCount, notes }, conn
    );

    await conn.commit();
    res.status(201).json({
      success: true,
      message: 'Booking request submitted. Our team will contact you shortly.',
      data: { id: bookingId }
    });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

exports.list = async (req, res, next) => {
  try {
    const { status, from, to, q, limit, offset } = req.query;
    const rows = await Booking.list({ status, from, to, q, limit, offset });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
};

exports.availability = async (req, res, next) => {
  try {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format (YYYY-MM-DD)' });
    }
    const [blocked, approved] = await Promise.all([
      BlockedDate.isBlocked(date),
      Booking.findApprovedOnDate(date)
    ]);
    if (blocked) {
      return res.json({
        success: true,
        available: false,
        reason: 'BLOCKED',
        message: 'This date is blocked and not available for booking.'
      });
    }
    if (approved) {
      return res.json({
        success: true,
        available: false,
        reason: 'BOOKED',
        message: 'Laxmi Palace Lawn is already booked on this date'
      });
    }
    res.json({ success: true, available: true, message: 'Date is available' });
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try {
    const result = await Booking.approve(req.params.id);
    if (!result.ok && result.code === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (!result.ok && result.code === 'DATE_TAKEN') {
      return res.status(409).json({
        success: false,
        message: 'Laxmi Palace Lawn is already booked on this date'
      });
    }
    res.json({ success: true, message: 'Booking approved' });
  } catch (err) { next(err); }
};

exports.reject = async (req, res, next) => {
  try {
    const ok = await Booking.setStatus(req.params.id, 'REJECTED');
    if (!ok) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking rejected' });
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const ok = await Booking.setStatus(req.params.id, 'CANCELLED');
    if (!ok) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) { next(err); }
};

exports.stats = async (_req, res, next) => {
  try {
    const stats = await Booking.stats();
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};
