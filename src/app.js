import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import familiesRoutes from './routes/families.routes.js';
import peopleRoutes from './routes/people.routes.js';
import relRoutes from './routes/relationships.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({ origin: corsOrigin || false }));
app.use(express.json());

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/families', familiesRoutes);
app.use('/api/families/:familyId/people', peopleRoutes);
app.use('/api/families/:familyId', relRoutes);

app.use(errorHandler);

export default app;
