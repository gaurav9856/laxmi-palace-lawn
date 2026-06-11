const { pool } = require('../config/database');

const Customer = {
  async upsert({ name, mobile, email }, conn) {
    const c = conn || pool;
    const [existing] = await c.query(
      'SELECT id FROM customers WHERE mobile = ? LIMIT 1',
      [mobile]
    );
    if (existing.length) {
      await c.query(
        'UPDATE customers SET name = ?, email = ? WHERE id = ?',
        [name, email || null, existing[0].id]
      );
      return existing[0].id;
    }
    const [r] = await c.query(
      'INSERT INTO customers (name, mobile, email) VALUES (?,?,?)',
      [name, mobile, email || null]
    );
    return r.insertId;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0] || null;
  }
};

module.exports = Customer;
