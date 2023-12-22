import boatMaterialModel from '../models/boatMaterialModel.js';
import boatModel from '../models/boatModel.js';
import boatTypeModel from '../models/boatTypeModel.js';
import { deleteImage, writeImage, replaceImage } from '../utils/fileStructure.js';
import { validateData } from '../utils/validator.js';

export const getAllBoats = async (req, res) => {
  try {
    const allBoats = await boatModel
      .find()
      .sort({ _id: -1 })
      .populate('material')
      .populate('boatType')
      .exec();

    res.status(200).json(allBoats);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Holen der Daten!' });
    return;
  }
};

export const getSingleBoats = async (req, res) => {
  const { id } = req.params;
  try {
    const singleBoat = await boatModel
      .findOne({ _id: id })
      .populate('material')
      .populate('boatType')
      .exec();

    res.status(200).json(singleBoat);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Holen der Daten!' });
    return;
  }
};

export const saveBoat = async (req, res) => {
  const boat = req.body;
  const imageFile = req.file;
  boat.imagePath = null;

  console.log(imageFile);

  // check if file
  if (imageFile) {
    const hasWriteFile = await writeImage(imageFile, boat);

    if (!hasWriteFile) {
      res.status(500).json({
        message: 'Fehler beim schreiben der Image Datei, Bitte wiederholen Sie die Eingabe!',
      });
      return;
    }
  }

  // Validate Incoming data
  const value = validateData(boat, res);

  if (!value) {
    return;
  }

  // Database
  try {
    const materialId = await boatMaterialModel.findByMaterial(value.material);
    const boatTypeId = await boatTypeModel.findByBoatType(value.type);

    if (!materialId || !boatTypeId) {
      deleteImage(boat.imagePath);
      res.status(500).json({ message: 'Fehler beim Finden der Referencen!' });
      return;
    }

    const newBoat = new boatModel({
      name: value.name,
      imagePath: value.imagePath,
      constructionYear: value.constructionYear,
      serialNumber: value.serialNumber,
      material: materialId,
      boatType: boatTypeId,
    });

    newBoat.save();

    res.status(201).json({ message: 'Boot wurde angelegt!' });
  } catch (error) {
    // delete wieder das Bild
    deleteImage(boat.imagePath);
    console.log(error);
    res.status(500).json({ message: 'Fehler beim Anlegen der Daten! unten' });
  }
};

export const editBoat = async (req, res) => {
  const { id } = req.params;
  const boat = req.body;
  const imageFile = req.file;

  // Wir holen uns den Pfad aus der db
  const path = await boatModel.findOne({ _id: id }, { imagePath: 1, _id: 0 });

  if (imageFile) {
    // Wir replace das Bild, der Pfad inklusive Filename bleibt der gleiche!
    const hasReplacedFile = await replaceImage(imageFile, path.imagePath, boat);

    if (!hasReplacedFile) {
      res.status(500).json({
        message: 'Fehler beim schreiben der Image Datei, Bitte wiederholen Sie die Eingabe!',
      });
      return;
    }
  } else {
    boat.imagePath = path.imagePath;
  }

  // Validate Incoming data
  const value = validateData(boat, res);

  if (!value) {
    return;
  }

  // db eintrag
  try {
    const materialId = await boatMaterialModel.findByMaterial(value.material);
    const boatTypeId = await boatTypeModel.findByBoatType(value.type);

    if (!materialId || !boatTypeId) {
      await deleteImage(boat.imagePath);
      res.status(500).json({ message: 'Fehler beim Finden der Referencen!' });
      return;
    }

    const editBoat = {
      name: value.name,
      imagePath: value.imagePath,
      constructionYear: value.constructionYear,
      serialNumber: value.serialNumber,
      material: materialId,
      boatType: boatTypeId,
    };

    const filter = { _id: id };

    await boatModel.findOneAndUpdate(filter, editBoat);

    res.status(201).json({ message: 'Boot wurde erfolgreich editiert!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Fehler beim Editieren der Daten!' });
  }
};

export const deleteBoat = async (req, res) => {
  const { id } = req.params;

  try {
    const path = await boatModel.findOne({ _id: id }, { imagePath: 1, _id: 0 });

    const filter = { _id: id };

    // delete image
    await deleteImage(path.imagePath);

    await boatModel.findByIdAndDelete(filter);

    res.status(201).json({ message: 'Datensatz erfolgreich gelöscht!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Fehler beim Editieren der Daten!' });
  }
};

/* SELECT FELDER  */
export const getAllMaterials = async (req, res) => {
  const allMaterials = await boatMaterialModel.find();

  res.status(200).json(allMaterials);
};
export const getAllBoatTypes = async (req, res) => {
  const allTypes = await boatTypeModel.find();

  res.status(200).json(allTypes);
};
