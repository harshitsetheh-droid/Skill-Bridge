import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import projectRoutes from './routes/projects.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import companyRoutes from './routes/company.js';
import institutionRoutes from './routes/institution.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.set('prisma', prisma);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/tpo', institutionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 3001;

async function main() {
  await prisma.$connect();
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export default app;
