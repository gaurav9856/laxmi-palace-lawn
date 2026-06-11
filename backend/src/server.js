// Local dev entry-point. For Vercel serverless deployment see /api/index.js
require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = Number(process.env.PORT) || 5000;

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
