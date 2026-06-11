// Vercel serverless entrypoint.
// Vercel automatically routes requests matching /api/* here.
// The Express app handles all routing internally.
const app = require('../src/app');
module.exports = app;
