const { pool } = require('../config/database');

const BlockedDate = {
  async list({ from, to } = {}) {
    const where = [];
    const params = [];
    if (from) { where.push('blocked_date >= ?'); params.push(from); }
    if (to)   { where.push('blocked_date <= ?'); params.push(to); }
    const sql = `SELECT id, blocked_date, reason, created_at FROM blocked_dates
                 ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY blocked_date ASC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  async isBlocked(date) {
    const [rows] = await pool.query(
      'SELECT id FROM blocked_dates WHERE blocked_date = ? LIMIT 1',
      [date]
    );
    return rows.length > 0;
  },
  async create({ date, reason }) {
    const [r] = await pool.query(
      'INSERT INTO blocked_dates (blocked_date, reason) VALUES (?, ?)',
      [date, reason || null]
    );
    return r.insertId;
  },
  async delete(id) {
    const [r] = await pool.query('DELETE FROM blocked_dates WHERE id = ?', [id]);
    return r.affectedRows > 0;
  }
};

module.exports = BlockedDate;
