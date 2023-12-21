import mongoose from 'mongoose';
import { findCollection, initialInserts } from '../utils/populate.js';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB);

    console.log('DATABASE CONNECTED');

    // Poulate boatType and boatMaterial
    if (findCollection('boatMaterials', connection) && findCollection('boatTypes', connection)) {
      await initialInserts();
    } else {
      await initialInserts();
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
