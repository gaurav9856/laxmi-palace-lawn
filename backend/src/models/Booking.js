const { pool } = require('../config/database');

const SELECT_FULL = `
  SELECT b.id, b.event_date, b.event_type, b.guest_count, b.status, b.notes,
         b.created_at, b.updated_at,
         c.id   AS customer_id,
         c.name AS customer_name,
         c.mobile AS customer_mobile,
         c.email AS customer_email
  FROM bookings b
  JOIN customers c ON c.id = b.customer_id
`;

const Booking = {
  async create({ customerId, eventDate, eventType, guestCount, notes }, conn) {
    const c = conn || pool;
    const [r] = await c.query(
      `INSERT INTO bookings (customer_id, event_date, event_type, guest_count, status, notes)
       VALUES (?,?,?,?, 'PENDING', ?)`,
      [customerId, eventDate, eventType, guestCount, notes || null]
    );
    return r.insertId;
  },

  async findApprovedOnDate(eventDate, conn) {
    const c = conn || pool;
    const [rows] = await c.query(
      `SELECT id FROM bookings WHERE event_date = ? AND status = 'APPROVED' LIMIT 1`,
      [eventDate]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(`${SELECT_FULL} WHERE b.id = ?`, [id]);
    return rows[0] || null;
  },

  async list({ status, from, to, q, limit = 100, offset = 0 } = {}) {
    const where = [];
    const params = [];
    if (status) { where.push('b.status = ?'); params.push(status); }
    if (from)   { where.push('b.event_date >= ?'); params.push(from); }
    if (to)     { where.push('b.event_date <= ?'); params.push(to); }
    if (q) {
      where.push('(c.name LIKE ? OR c.mobile LIKE ? OR c.email LIKE ? OR b.event_type LIKE ?)');
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }
    const sql = `${SELECT_FULL} ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY b.event_date DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async setStatus(id, status) {
    const [r] = await pool.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    return r.affectedRows > 0;
  },

  async approve(id) {
    // Use transaction so we can re-check the date is still free.
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [[booking]] = await conn.query(
        'SELECT id, event_date, status FROM bookings WHERE id = ? FOR UPDATE',
        [id]
      );
      if (!booking) { await conn.rollback(); return { ok: false, code: 'NOT_FOUND' }; }
      if (booking.status === 'APPROVED') { await conn.rollback(); return { ok: true }; }
      const existing = await Booking.findApprovedOnDate(booking.event_date, conn);
      if (existing) {
        await conn.rollback();
        return { ok: false, code: 'DATE_TAKEN' };
      }
      await conn.query(`UPDATE bookings SET status = 'APPROVED' WHERE id = ?`, [id]);
      await conn.commit();
      return { ok: true };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  async approvedDatesBetween(start, end) {
    const [rows] = await pool.query(
      `SELECT event_date FROM bookings
       WHERE status = 'APPROVED' AND event_date BETWEEN ? AND ?`,
      [start, end]
    );
    return rows.map(r => r.event_date);
  },

  async stats() {
    const today = new Date().toISOString().slice(0, 10);
    const firstOfMonth = today.slice(0, 8) + '01';
    const [[totals]] = await pool.query(
      `SELECT
        SUM(status='PENDING')   AS pending,
        SUM(status='APPROVED')  AS approved,
        SUM(status='REJECTED')  AS rejected,
        SUM(status='CANCELLED') AS cancelled,
        COUNT(*) AS total
       FROM bookings`
    );
    const [[upcoming]] = await pool.query(
      `SELECT COUNT(*) AS upcoming FROM bookings
       WHERE status = 'APPROVED' AND event_date >= ?`,
      [today]
    );
    const [[revenue]] = await pool.query(
      `SELECT COALESCE(SUM(p.amount),0) AS revenue
       FROM payments p
       JOIN bookings b ON b.id = p.booking_id
       WHERE p.payment_status = 'PAID'
         AND p.payment_date >= ?`,
      [firstOfMonth]
    );
    return {
      total: Number(totals.total) || 0,
      pending: Number(totals.pending) || 0,
      approved: Number(totals.approved) || 0,
      rejected: Number(totals.rejected) || 0,
      cancelled: Number(totals.cancelled) || 0,
      upcoming: Number(upcoming.upcoming) || 0,
      monthlyRevenue: Number(revenue.revenue) || 0
    };
  }
};

module.exports = Booking;
