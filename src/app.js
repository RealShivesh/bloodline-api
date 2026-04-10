import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import familiesRoutes from './routes/families.routes.js';
import peopleRoutes from './routes/people.routes.js';
import relRoutes from './routes/relationships.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/families', familiesRoutes);
app.use('/api/families/:familyId/people', peopleRoutes);
app.use('/api/families/:familyId', relRoutes);

app.use(errorHandler);

export default app;
