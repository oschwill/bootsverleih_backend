import bcrypt from 'bcrypt';
import { userSchema, validateData } from '../utils/validator.js';
import userModel from '../models/userModel.js';

export const registerUser = async (req, res) => {
  const userData = req.body;

  try {
    // validate data
    const value = validateData(userData, res, userSchema);

    if (!value) {
      return;
    }

    // hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // in die Datenbank kloppen
    const newUser = new userModel({
      userName: value.userName,
      email: value.email,
      password: hashedPassword,
    });

    newUser.save();

    res.status(201).json({
      success: true,
      message: 'Der User wurde angelegt!',
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: 'Fehler beim Anlegen des Users!',
    });
  }
};

export const loginUser = (req, res) => {
  res.json({
    success: true,
    userName: req.userName,
  });
};
