import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Need a username'],
  },
  email: {
    type: String,
    required: [true, 'Need a email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a correct Email Adress'],
  },
  password: {
    type: String,
    required: [true, 'Need a Password'],
    minLength: [6, 'A password must be at least more or equal 6 characters'],
  },
});

export default mongoose.model('userModel', userSchema, 'users');
