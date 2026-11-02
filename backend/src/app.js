/**
 * Express application.
 *
 * Sets up security middleware, CORS, body parsing, routes, and error
 * handling. This file is separate from server.js so tests can import
 * the app without starting a server.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import apiRoutes from './routes/api.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { config } from './config/index.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Render and other PaaS providers put the app behind a proxy
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// CORS — allow only the configured frontend origin
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));

// Request logging in development
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check (used by Render and uptime monitors)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public API
app.use('/api', apiLimiter, apiRoutes);

// Admin API (protected)
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;