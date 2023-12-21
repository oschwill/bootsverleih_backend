import mongoose from 'mongoose';

/**
 * Baujahr, Seriennummer, Material[GFK,Holz,Metall,Pappe,Seelen]
 * Bootsart[Tretboot,Segelboot,Luftkissenboot,Geisterschiff,Containerschiff]
 * Farbpallete
 */
const boatTypeSchema = new mongoose.Schema({
  typeName: {
    type: String,
    required: [true, 'Please type in a Boat Type'],
    unique: true,
    trim: true,
  },
});

boatTypeSchema.statics.findByBoatType = async function (boatType) {
  const _boatType = await this.where({ typeName: boatType });

  if (_boatType.length === 0) {
    return null;
  }

  return _boatType[0]._id;
};

export default mongoose.model('boatTypeModel', boatTypeSchema, 'boatTypes');
