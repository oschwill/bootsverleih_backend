import express from 'express';
import {
  getAllReservations,
  getFreeBoats,
  saveReservation,
} from '../controller/reservationController.js';
export const router = express.Router();

// ROUTES
router.route('/data').get(getAllReservations);
router.route('/data').post(saveReservation);
router.route('/free').post(getFreeBoats);
