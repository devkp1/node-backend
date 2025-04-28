import userModel from './user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../../utils/responseHandler.js';
import {
  getHashPassword,
  comparePassword,
} from '../../utils/password.utils.js';
import { userValidations } from '../../validators/user.validation.js';
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
} from '../../constants/responseMessages.js';
import { statusCodes } from '../../constants/statusCodeMessages.js';
import { validateInput } from '../../common/validation.js';
import { generateAccessToken } from '../../utils/tokenGenerator.js';
import logger from '../../logger.js';

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const isValid = validateInput(
      userValidations,
      {
        firstName,
        lastName,
        email,
        password,
      },
      res,
    );

    if (!isValid) return;

    const hashedPassword = await getHashPassword(password);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return successResponse(res, user, userRegisterMessage, statusCodes.SUCCESS);
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      { accessToken },
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
