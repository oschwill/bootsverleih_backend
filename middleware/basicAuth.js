import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

const decodeBase64 = (base64String) => Buffer.from(base64String, 'base64').toString();

export const basicAuth = async (req, res, next) => {
  // auth
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization erforderlich',
    });
  }

  const [authType, authEmailBase64] = authHeader.split(' ');

  if (authType !== 'Basic' || !authEmailBase64) {
    return res.status(401).json({
      success: false,
      message: 'Bitte authorisieren Sie sich mit basic auth',
    });
  }

  const authInfo = decodeBase64(authEmailBase64);
  const [email, password] = authInfo.split(':');

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: 'Bitte authorisieren Sie sich mit basic auth',
    });
  }

  // Wir holen uns den User
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Authorisierung fehlgeschlagen',
    });
  }

  if (await bcrypt.compare(password, user.password)) {
    const user = await userModel.findOne({ email });
    req.userName = user.userName;
    req.userId = user._id;
    next();
    return;
  } else {
    return res.status(401).json({
      success: false,
      message: 'Authorisierung fehlgeschlagen',
    });
  }
};
