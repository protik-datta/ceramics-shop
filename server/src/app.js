import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import adminRoutes from './routes/admin.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());

const allowed = [process.env.CLIENT_ORIGIN || 'http://localhost:5173', process.env.ADMIN_ORIGIN || 'http://localhost:5174'].join(',')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''));
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Idempotency-Key'],
  })
);
app.use(express.json({ limit: '10kb' }));
app.use('/api/orders', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }));
app.use('/api/admin', adminRoutes);
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
