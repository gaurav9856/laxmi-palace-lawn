// Idempotent seed: ensures a SUPER_ADMIN exists using env credentials.
// Run: node src/utils/seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const Admin = require('../models/Admin');

(async () => {
  const name = process.env.SEED_ADMIN_NAME || 'Super Admin';
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@laxmipalace.in';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

  try {
    const existing = await Admin.findByEmail(email);
    const hash = await bcrypt.hash(password, 10);
    if (existing) {
      await pool.query('UPDATE admins SET password_hash = ?, name = ? WHERE id = ?',
        [hash, name, existing.id]);
      console.log(`[seed] updated admin: ${email}`);
    } else {
      const id = await Admin.create({ name, email, passwordHash: hash, role: 'SUPER_ADMIN' });
      console.log(`[seed] created super admin id=${id} email=${email}`);
    }
    console.log(`[seed] login with: ${email} / ${password}`);
    process.exit(0);
  } catch (e) {
    console.error('[seed] failed:', e.message);
    process.exit(1);
  }
})();
