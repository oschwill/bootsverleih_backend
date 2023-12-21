import boatMaterialModel from '../models/boatMaterialModel.js';
import boatTypeModel from '../models/boatTypeModel.js';

export const initialInserts = async () => {
  // insert BoatTypes and boatMaterials
  try {
    const boatTypeData = [
      { typeName: 'Tretboot' },
      { typeName: 'Segelboot' },
      { typeName: 'Luftkissenboot' },
      { typeName: 'Geisterschiff' },
      { typeName: 'Containerschiff' },
      { typeName: 'Avengers Luftschiff' },
    ];

    const boatMaterialData = [
      { name: 'GFK' },
      { name: 'Holz' },
      { name: 'Metall' },
      { name: 'Pappe' },
      { name: 'Seelen' },
      { name: 'Stahl' },
      { name: 'Adamantium' },
    ];

    boatTypeData.forEach(async (item) => {
      await boatTypeModel.findOneAndUpdate(item, item, { upsert: true });
    });

    boatMaterialData.forEach(async (item) => {
      await boatMaterialModel.findOneAndUpdate(item, item, { upsert: true });
    });

    console.log('DATA INSERTED ERFOLGREICH');
  } catch (error) {
    console.log('Fehler beim einfügen der Daten', error);
  }
};

export const findCollection = (collectionName, mongoose) => {
  const collections = mongoose.connection.collections;
  let collectionFound = false;

  for (let collection in collections) {
    if (collection === collectionName) {
      collectionFound = true;
    }
  }

  return collectionFound;
};
