import reservationModel from '../models/reservationModel.js';

export const getNextSequence = async (filter) => {
  var reservation = await reservationModel.find({}, {}, filter).limit(1).exec();

  return reservation[0]?.reservationNumber;
};
