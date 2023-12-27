import express from 'express';
import cors from 'cors';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import 'dotenv/config';
import connectDB from './config/db.js';
import { AppError } from './utils/appError.js';
import { router as boatRouter } from './routes/boatRouter.js';
import { router as reservationRouter } from './routes/reservationRouter.js';
import { createImageFolder } from './utils/fileStructure.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(xss());
app.use(mongoSanitize());

// static files
app.use('/data/images', express.static('data/images'));
// DATABASE CONNECTION
connectDB();
// Image Folder erstellen
createImageFolder();

// ROUTES
app.use('/api/v1/boats', boatRouter);
app.use('/api/v1/reservation', reservationRouter);

// unhandled Routes
app.all('*', (req, res, next) => {
  // mit next springen wir zur nächsten middleware

  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => console.log('RUNNING on' + PORT));
