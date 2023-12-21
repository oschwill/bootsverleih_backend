import mongoose from 'mongoose';

const boatMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have a material Name'],
  },
});

boatMaterialSchema.statics.findByMaterial = async function (material) {
  const _material = await this.where({ name: material });

  if (_material.length === 0) {
    return null;
  }

  return _material[0]._id;
};

export default mongoose.model('boatMaterialModel', boatMaterialSchema, 'boatMaterials');
