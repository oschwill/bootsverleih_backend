import express from 'express';
import multer from 'multer';
import { loginUser, registerUser } from '../controller/userController.js';
import { basicAuth } from '../middleware/basicAuth.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });
export const router = express.Router();

// ROUTES
router.route('/register').post(upload.none(), registerUser);
router.route('/login').post(basicAuth, loginUser);
