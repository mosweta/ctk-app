/**
 * Entry point.
 *
 * Starts the HTTP server and registers graceful shutdown handlers.
 * This file is thin — all logic lives in app.js.
 */

import app from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.PORT, () => {
  console.log(`[${config.NODE_ENV}] Server listening on port ${config.PORT}`);
  console.log(`[CORS] Allowing origin: ${config.FRONTEND_URL}`);
});

// Graceful shutdown so Render can rotate instances without dropping requests
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000); // Force exit after 10s
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));