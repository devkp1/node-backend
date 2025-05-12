import userModel from './user.model.js';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { successResponse, errorResponse } from '../../utils/responseHandler.js';
import {
  getHashPassword,
  comparePassword,
} from '../../utils/password.utils.js';
import {
  userValidations,
  loginValidations,
  resetPasswordValidations,
} from '../../validators/user.validation.js';
import {
  EmailAndPasswordRequiredMessage,
  EmailPasswordMatchMessage,
  ServerErrorMessage,
  UserNotFoundMessage,
  NotFoundErrorMessage,
  UnauthroizedErrorMessage,
  ValidationErrorMessage,
  emailUniqueMessage,
  InvalidOrExpireOTP,
  UserInfoRequiredMessage,
  passwordNotMatch,
  incorrectCurrentPassword,
} from '../../constants/errorMessages.js';
import {
  otpSentMessage,
  otpVerifiedSuccessfully,
  passwordResetSuccessMessage,
  userRegisterMessage,
  userLoginMessage,
  userDataAddedSccuessfully,
  logoutSuccessMessage,
} from '../../constants/responseMessages.js';
import { statusCodes } from '../../constants/statusCodeMessages.js';
import { validateInput } from '../../common/validation.js';
import { generateAccessToken } from '../../utils/tokenGenerator.js';
import logger from '../../logger.js';
import { validateAllowedFields } from '../../utils/checkAllowedFields.js';
import { generateOTP, sendOTPEmail } from '../../utils/otp.utils.js';
import { blacklistedToken } from '../../utils/tokenManager.js';
import { useReducer } from 'react';

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const allowedFields = ['fullName', 'email', 'password'];
    if (!validateAllowedFields(allowedFields, req.body, res)) return;

    const isValid = validateInput(
      userValidations,
      {
        fullName,
        email,
        password,
      },
      res,
    );

    if (!isValid) return;

    const hashedPassword = await getHashPassword(password);

    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const user = await userModel.findById(
      newUser._id,
      'fullName email password createdAt updatedAt',
    );

    const accessToken = generateAccessToken(user);
    const { _id, createdAt, updatedAt } = newUser;
    const updatedUser = {
      id: _id,
      fullName,
      email,
      createdAt,
      updatedAt,
      accessToken,
    };

    return successResponse(
      res,
      updatedUser,
      userRegisterMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email) {
      logger.error(`Registration error: ${emailUniqueMessage}`);
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        emailUniqueMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    logger.error(`Registration error: ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const allowedFields = ['email', 'password'];
    if (!validateAllowedFields(allowedFields, req.body, res)) return next();

    const isValid = validateInput(loginValidations, { email, password }, res);

    if (!isValid) return;

    if (!email || !password) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        EmailAndPasswordRequiredMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return errorResponse(
        res,
        new Error(UnauthroizedErrorMessage),
        EmailPasswordMatchMessage,
        statusCodes.UNAUTHORIZED,
      );
    }

    const accessToken = generateAccessToken(user);

    return successResponse(
      res,
      { id: user._id, accessToken },
      userLoginMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const userInfo = async (req, res) => {
  try {
    const { gender, dob, houseNumber, address, pincode, city, state, country } =
      req.body;
    const userId = req.user.userId;
    const pincodes = Number(pincode);

    const allowedFields = [
      'gender',
      'dob',
      'houseNumber',
      'address',
      'pincode',
      'city',
      'state',
      'country',
    ];

    if (!validateAllowedFields(allowedFields, req.body, res)) return;

    let user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(
        res,
        new Error(UserNotFoundMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    user.gender = gender;
    user.dob = moment(dob).format('DD/MM/YYYY');
    user.houseNumber = houseNumber;
    user.address = address;
    user.pincode = pincodes;
    user.city = city;
    user.state = state;
    user.country = country;
    await user.save();

    user = await user.populate([
      { path: 'city', select: 'name' },
      { path: 'state', select: 'name' },
      { path: 'country', select: 'name' },
    ]);

    const updatedUser = {
      id: user._id,
      gender: user.gender,
      dob: moment(user.dob).format('DD/MM/YYYY'),
      houseNumber: user.houseNumber,
      address: user.address,
      pincode: user.pincode,
      city: {
        id: user.city._id,
        name: user.city.name,
      },
      state: {
        id: user.state._id,
        name: user.state.name,
      },
      country: {
        id: user.country._id,
        name: user.country.name,
      },
    };

    return successResponse(
      res,
      updatedUser,
      userDataAddedSccuessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error('updateUserGenderDob error..........', error.message);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const requestOTP = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await userModel.findByOne({ email: userEmail });
    if (!user) {
      return errorResponse(
        res,
        new Error(UserNotFoundMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpires = moment().add(10, 'minutes').toDate();

    await user.save();

    await sendOTPEmail(user.email, otp);
    console.log('new otp?????????', user.otp);
    return successResponse(res, null, otpSentMessage, statusCodes.SUCCESS);
  } catch (error) {
    logger.error(`requestOTP error....... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findByOne({ email });
    if (!user || user.otp != otp || moment().isAfter(user.otpExpires)) {
      return errorResponse(
        res,
        new Error(InvalidOrExpireOTP),
        InvalidOrExpireOTP,
        statusCodes.UNAUTHORIZED,
      );
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOTPVerified = true;
    await user.save();

    return successResponse(
      res,
      null,
      otpVerifiedSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`OTP verification error...... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findONe({ email });

    if (!user) {
      return errorResponse(
        res,
        new Error(UserInfoRequiredMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    if (!user.isOTPVerified) {
      return errorResponse(
        res,
        new Error(UnauthroizedErrorMessage),
        InvalidOrExpireOTP,
        statusCodes.UNAUTHORIZED,
      );
    }

    user.password = await getHashPassword(newPassword);
    user.isOTPVerified = false;
    await user.save();

    return successResponse(
      res,
      null,
      passwordResetSuccessMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`forgotPassword error..... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const resetPassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (
      !validateInput(
        resetPasswordValidations,
        { newPassword, confirmNewPassword },
        res,
      )
    )
      return;

    if (newPassword !== confirmNewPassword) {
      return errorResponse(
        res,
        new Error(passwordNotMatch),
        passwordNotMatch,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(
        res,
        new Error(UserNotFoundMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return errorResponse(
        res,
        new Error('incorrect current password'),
        incorrectCurrentPassword,
        statusCodes.UNAUTHORIZED,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return successResponse(
      res,
      null,
      passwordResetSuccessMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`Password reset error...... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.token;

    await blacklistedToken(token);

    return successResponse(
      res,
      null,
      logoutSuccessMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`Logout error...... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
