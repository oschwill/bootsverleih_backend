import mongoose from 'mongoose';
import { deleteImage } from '../utils/fileStructure.js';

/**
 * Baujahr, Seriennummer, Material[GFK,Holz,Metall,Pappe,Seelen]
 * Bootsart[Tretboot,Segelboot,Luftkissenboot,Geisterschiff,Containerschiff]
 */
const boatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Need a boat name'],
  },
  imagePath: String,
  constructionYear: {
    type: Number,
    required: [true, 'Need a construction year'],
  },
  serialNumber: {
    type: String,
    required: [true, 'Need a SerialNumber'],
    maxlength: [10, 'Serialnumber must be max 10 characters'],
  },
  material: {
    type: mongoose.Schema.ObjectId,
    ref: 'boatMaterialModel',
  },
  boatType: {
    type: mongoose.Schema.ObjectId,
    ref: 'boatTypeModel',
  },
});

export default mongoose.model('boatModel', boatSchema, 'boats');
