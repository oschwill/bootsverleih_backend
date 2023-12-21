import express from 'express';
import cors from 'cors';
import xss from 'xss-clean';
import 'dotenv/config';
import connectDB from './config/db.js';
import { router as boatRouter } from './routes/boatRouter.js';
import { router as reservationRouter } from './routes/reservationRouter.js';
import { createImageFolder } from './utils/fileStructure.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(xss());

// DATABASE CONNECTION
connectDB();
// Image Folder erstellen
createImageFolder();

// ROUTES
app.use('/api/v1/boats', boatRouter);
app.use('/api/v1/reservation', reservationRouter);
// app.use('(api/v1/reservations')

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log('RUNNING on' + PORT));
