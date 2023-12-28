import express from 'express';
import multer from 'multer';
import {
  deleteBoat,
  editBoat,
  getAllBoatTypes,
  getAllBoats,
  getAllMaterials,
  getSingleBoats,
  saveBoat,
} from '../controller/boatController.js';
import { basicAuth } from '../middleware/basicAuth.js';
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const router = express.Router();

// ROUTES
router.route('/data').get(getAllBoats);
router.route('/data/:id').get(getSingleBoats);
router.route('/data/').post(basicAuth, upload.single('boat_img'), saveBoat);
router.route('/data/:id').put(basicAuth, upload.single('boat_img'), editBoat);
router.route('/data/:id').delete(basicAuth, deleteBoat);

// SelectFilter Routen
router.route('/materials').get(getAllMaterials);
router.route('/boat-types').get(getAllBoatTypes);
