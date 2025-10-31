import express from 'express';
import { createServer } from 'http';
import next from 'next';
import cors from 'cors'; // Exemple de middleware

// Import des routeurs
import authRouter from "@/app/api/auth/route";
import calendarRouter from "@/app/api/calendar/route";
import calendarIdRouter from "@/app/api/calendar/route";
import callsRouter from "@/app/api/calls/route";
import callsIdRouter from "@/app/api/calls/route";
import clientsRouter from "@/app/api/clients/route";
import clientsIdRouter from "@/app/api/clients/route";
import invoicesRouter from "@/app/api/invoices/route";
import invoicesIdRouter from "@/app/api/invoices/route";
import serviceRouter from '@/app/api/services/route';
import serviceIdRouter from '@/app/api/services/[id]/route';
import userRouter from '@/app/api/user/route';
import userIdRouter from '@/app/api/user/[id]/route';
import userServiceRouter from '@/app/api/UserServices/route';
import userServiceIdRouter from '@/app/api/UserServices/[userId]/route';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressApp = express();

  // Middlewares
  expressApp.use(cors());
  expressApp.use(express.json());

  // Routes API
  expressApp.use('/api/auth', authRouter);
  expressApp.use('/api/calendar', calendarRouter);
  expressApp.use('/api/calendar', calendarIdRouter);
  expressApp.use('/api/calls', callsRouter);
  expressApp.use('/api/calls', callsIdRouter);
  expressApp.use('/api/clients', clientsRouter);
  expressApp.use('/api/clients', clientsIdRouter);
  expressApp.use('/api/invoices', invoicesRouter);
  expressApp.use('/api/invoices', invoicesIdRouter);
  expressApp.use('/api/services', serviceRouter);
  expressApp.use('/api/services', serviceIdRouter); // :id est capturé ici
  expressApp.use('/api/user', userRouter);
  expressApp.use('/api/user', userIdRouter);       // :id est capturé ici
  expressApp.use('/api/userServices', userServiceRouter);
  expressApp.use('/api/userServices', userServiceIdRouter); // :userId et :serviceId capturés

  // Route de test
  expressApp.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  // Fallback vers Next.js (pour les pages comme /dashboard, /profile, etc.)
  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  const server = createServer(expressApp);
  server.listen(3000, () => {
    console.log('> Server ready on http://localhost:3000');
  });
});
