import boatModel from '../models/boatModel.js';
import reservationModel from '../models/reservationModel.js';

export const saveReservation = async (req, res) => {
  const newReservation = req.body;

  try {
    const newRes = new reservationModel({
      reservedBoat: newReservation.boatId,
      reservedStartDate: new Date(newReservation.startDate),
      reservedEndDate: new Date(newReservation.endDate),
    });

    newRes.save();

    res.status(201).json({ message: 'Reservierung angelegt' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Fehler beim Anlegen der Reservierung' });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const allReservations = await reservationModel
      .find()
      .populate('reservedBoat')
      .sort({ _id: -1 })
      .exec();

    res.status(200).json(allReservations);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Holen der Daten!' });
    return;
  }
};

export const getFreeBoats = async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate || startDate === 'undefined' || endDate === 'undefined') {
    console.log('first');
    res.status(400).json({ message: 'Fehler beim Filtern der Daten' });
    return;
  }

  try {
    /* UND NUN FOLGT...ein...was mache ich hier eigentlich. */
    // Holen uns erstmal alle Boote die noch nie reserviert wurden!
    let allReservedBoatIDs = await reservationModel.find().distinct('reservedBoat').exec();
    let unReservedBoats = await boatModel.find().where('_id').nin(allReservedBoatIDs).exec();

    // Schauen erstmal wo das start und end datum zutrifft und holen uns mal die ids ne
    const equalDateQuery = {
      reservedStartDate: { $eq: new Date(startDate) },
      reservedEndDate: { $eq: new Date(endDate) },
    };

    let checkDatesByDate = await reservationModel.find(equalDateQuery, { reservedBoat: 1 });

    // dann fragen wir ab ob größer kleiner usw. und pupulaten uns die Boote schonmal
    const checkGreaterOrQuery = {
      $or: [{ reservedStartDate: { $gte: endDate } }, { reservedEndDate: { $lte: startDate } }],
    };

    let unReservedBoatsByDate = await reservationModel
      .find(checkGreaterOrQuery)
      .populate('reservedBoat')
      .exec();

    // und nun filtern wir nochmal den equal query vom Anfang heraus :) so einfach ist das alles.
    for (const item of checkDatesByDate) {
      unReservedBoatsByDate = unReservedBoatsByDate
        .filter((cur) => cur.reservedBoat._id.toString() !== item.reservedBoat.toString())
        .filter(
          (v, i, a) =>
            a.findIndex(
              (v2) => v2.reservedBoat._id.toString() === v.reservedBoat._id.toString()
            ) === i
        );
    }

    // Mensch war das einfach! nun müssen wir nur noch die Scheisse mergen wie ein Profi
    unReservedBoatsByDate.forEach((item) => {
      unReservedBoats.push(item.reservedBoat);
    });

    // und schießen die Daten zum... äh client
    res.status(200).json(unReservedBoats);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Filtern der Daten' });
    return;
  }
};

export const deleteReservation = async (req, res) => {
  const { rnr } = req.params;
  console.log(rnr);
  if (!rnr || rnr === undefined) {
    res.status(400).json({ message: 'Fehler beim finden der Reserverierungsnummer' });
    return;
  }

  try {
    const hasDeleted = await reservationModel.deleteOne({ reservationNumber: rnr });

    console.log(hasDeleted);
    if (hasDeleted.acknowledged && hasDeleted.deletedCount === 1) {
      res.status(201).json({ message: 'Die Reservierung wurde erfolgreich gelöscht' });
      return;
    } else {
      res.status(400).json({ message: 'Fehler beim Löschen der Reservierung' });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Löschen der Reservierung' });
    return;
  }
};
