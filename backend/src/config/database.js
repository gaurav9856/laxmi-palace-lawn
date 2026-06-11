const mysql = require('mysql2/promise');
require('dotenv').config();

// On Vercel (serverless), keep the pool small so we don't exhaust the
// database's connection limit when many functions cold-start in parallel.
const isServerless = !!process.env.VERCEL;

const sslOption = process.env.DB_SSL === 'true' || isServerless
  ? { rejectUnauthorized: true }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'laxmi_palace_lawn',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || (isServerless ? 2 : 10),
  queueLimit: 0,
  dateStrings: true,
  timezone: '+05:30',
  ssl: sslOption
});

async function testConnection() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}

module.exports = { pool, testConnection };
