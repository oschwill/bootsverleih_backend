import fs from 'fs/promises';
import { fileTypeFromBuffer } from 'file-type';
import { v4 } from 'uuid';

const dirPath = 'data';
const imageFolder = 'images';
const imagePath = `${dirPath}/${imageFolder}`;

export const createImageFolder = () => {
  fs.access(dirPath)
    .then(() => console.log(`${dirPath}/${imageFolder} Pfad ist bereits vorhanden!`))
    .catch(async () => {
      await fs.mkdir(dirPath);
      await fs.mkdir(`${dirPath}/${imageFolder}`);
      console.log(`${dirPath} wurde erstellt!`);
    });
};

export const writeImage = async (imageFile, boat) => {
  try {
    // Schreiben die Datei
    const data = await fileTypeFromBuffer(imageFile.buffer);
    const path = `${imagePath}/${v4()}.${data.ext}`;
    fs.writeFile(path, imageFile.buffer);
    boat.imagePath = path;
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteImage = async (imageFile) => {
  await fs.unlink(imageFile);
};

export const replaceImage = async (imageFile, path, boat) => {
  const checkPath = path;
  try {
    const returnVal = await fs
      .access(path)
      .then(async () => {
        // delete old picture
        await deleteImage(checkPath);

        const data = await fileTypeFromBuffer(imageFile.buffer);
        const path = `${imagePath}/${v4()}.${data.ext}`;

        await fs.writeFile(path, imageFile.buffer);
        boat.imagePath = path;
        return true;
      })
      .catch(() => {
        return false;
      });

    return returnVal;
  } catch (error) {
    return false;
  }
};
