import mongoose from 'mongoose';
import { getNextSequence } from '../utils/dbHelper.js';

const reservationSchema = new mongoose.Schema({
  reservedBoat: {
    type: mongoose.Schema.ObjectId,
    ref: 'boatModel',
    required: [true, 'Must belong a boat'],
  },
  reservationNumber: {
    type: Number,
    unique: true,
    required: [true, 'Must have a reservation Number'],
    default: 1,
  },
  reservedStartDate: {
    type: Date,
    required: [true, 'Must have a start date'],
  },
  reservedEndDate: {
    type: Date,
    required: [true, 'Must have a start date'],
  },
  userName: {
    type: mongoose.Schema.ObjectId,
    ref: 'userModel',
    required: [true, 'Must belong a user'],
  },
});

reservationSchema.pre('save', async function (next) {
  const self = this;
  const filter = { sort: { reservationNumber: -1 } };

  const lastNumber = await getNextSequence(filter);

  // increment Reservierungsnummer!
  self.reservationNumber = lastNumber !== 'undefined' && lastNumber + 1;
  next();
});

export default mongoose.model('reservationModel', reservationSchema, 'reservations');
