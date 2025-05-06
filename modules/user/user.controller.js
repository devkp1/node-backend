import userModel from './user.model.js';
import moment from 'moment';
import { successResponse, errorResponse } from '../../utils/responseHandler.js';
import {
  getHashPassword,
  comparePassword,
} from '../../utils/password.utils.js';
import {
  userValidations,
  loginValidations,
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
} from '../../constants/errorMessages.js';
import {
  userRegisterMessage,
  userLoginMessage,
  userDataAddedSccuessfully,
} from '../../constants/responseMessages.js';
import { statusCodes } from '../../constants/statusCodeMessages.js';
import { validateInput } from '../../common/validation.js';
import { generateAccessToken } from '../../utils/tokenGenerator.js';
import logger from '../../logger.js';
import { validateAllowedFields } from '../../utils/checkAllowedFields.js';

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

    console.log('res.........', res);
    console.log('user.........', user);
    console.log('accessToken.........', accessToken);
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

    const user = await userModel.findById(userId);
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
    user.pincode = pincode;
    user.city = city;
    user.state = state;
    user.country = country;
    await user.save();

    const updatedUser = {
      id: user._id,
      gender: user.gender,
      dob: moment(user.dob).format('DD/MM/YYYY'),
      houseNumber: user.houseNumber,
      address: user.address,
      pincode: user.pincode,
      city: user.city,
      state: user.state,
      country: user.country,
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
