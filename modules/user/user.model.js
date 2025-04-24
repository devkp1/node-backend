import mongoose, { Schema } from 'mongoose';
import { UserModelSchema } from '../../constants/modelNameConstants';
import {
  emailRequiredMessage,
  firstNameRequiredMessage,
  lastNameRequiredMessage,
  passwordRequiredMessage,
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
      unique: true,
    },
    email: {
      type: String,
      required: [true, emailRequiredMessage],
      unqiue: true,
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
    },
    gender: {
      type: String,
      enum: ['man', 'woman', 'other'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    houseNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
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
