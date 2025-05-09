import mongoose, { Schema } from 'mongoose';
import { UserModelSchema } from '../../constants/modelNameConstants.js';
import {
  emailRequiredMessage,
  emailUniqueMessage,
  fullNameRequiredMessage,
  passwordRequiredMessage,
} from '../../constants/errorMessages.js';
import { Gender } from '../../enums/userEnum.js';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, fullNameRequiredMessage],
    },
    countryCode: {
      type: Number,
      default: 91,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      required: [true, emailRequiredMessage],
      unqiue: [true, emailUniqueMessage],
    },
    dob: {
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
      enum: Gender,
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
      type: Number,
      default: 0,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      default: null,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      default: null,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      default: null,
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
