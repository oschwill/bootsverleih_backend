import express from 'express';
import {
  deleteReservation,
  getAllReservations,
  getFreeBoats,
  saveReservation,
} from '../controller/reservationController.js';
import { basicAuth } from '../middleware/basicAuth.js';
export const router = express.Router();

// ROUTES
router.route('/data').get(getAllReservations);
router.route('/data').post(basicAuth, saveReservation);
router.route('/data/:rnr').delete(basicAuth, deleteReservation);
router.route('/free').post(basicAuth, getFreeBoats);
