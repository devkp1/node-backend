import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unqiue: true,
    },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    otp: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ['man', 'woman', 'other'],
      require: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    houseNumber: {
      type: String,
      require: true,
    },
    area: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    pincode: {
      type: Number,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
    countryCode: {
      type: Number,
      require: 91,
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

const User = mongoose.model('User', userSchema);

export default User;
