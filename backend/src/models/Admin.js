const { pool } = require('../config/database');

const Admin = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role FROM admins WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },
  async create({ name, email, passwordHash, role = 'ADMIN' }) {
    const [r] = await pool.query(
      'INSERT INTO admins (name, email, password_hash, role) VALUES (?,?,?,?)',
      [name, email, passwordHash, role]
    );
    return r.insertId;
  }
};

module.exports = Admin;
