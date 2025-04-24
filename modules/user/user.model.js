import mongoose, { Schema } from 'mongoose';
import { UserModelSchema } from '../../constants/modelNameConstants';
import {
  emailRequiredMessage,
  emailUniqueMessage,
  firstNameRequiredMessage,
  lastNameRequiredMessage,
  passwordRequiredMessage,
  phoneNumberUniqueMessge,
} from '../../constants/errorMessages';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, firstNameRequiredMessage],
    },
    lastName: {
      type: String,
      required: [true, lastNameRequiredMessage],
    },
    countryCode: {
      type: Number,
      default: 91,
    },
    phoneNumber: {
      type: String,
      unique: [true, phoneNumberUniqueMessge],
    },
    email: {
      type: String,
      required: [true, emailRequiredMessage],
      unqiue: [true, emailUniqueMessage],
    },
    dateOfBirth: {
      type: Date,
    },
    password: {
      type: String,
      required: [true, passwordRequiredMessage],
    },
    otp: {
      type: String,
      maxlength: 6,
      default: '000000',
    },
    gender: {
      type: String,
      enum: ['man', 'woman', 'other'],
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    houseNumber: {
      type: String,
      default: '',
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model(UserModelSchema, userSchema);

export default User;
