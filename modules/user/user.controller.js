import userModel from './user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../../utils/responseHandler.js';
import { getHashPassword } from '../../utils/password.utils.js';
import { userValidations } from '../../validators/user.validation.js';
import {
  EmailAndPasswordRequiredMessage,
  EmailPasswordMatchMessage,
  ServerErrorMessage,
  UserNotFoundMessage,
} from '../../constants/errorMessages.js';
import { userRegisterMessage } from '../../constants/responseMessages.js';
import { statusCodes } from '../../constants/statusCodeMessages.js';
import logger from '../../logger.js';

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const { error } = userValidations.validate({
      firstName,
      lastName,
      email,
      password,
    });

    if (error) {
      res.status(400);
      return next(error);
    }

    const hashedPassword = await getHashPassword(password);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      status: true,
      message: userRegisterMessage,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        new Error(EmailAndPasswordRequiredMessage),
        EmailAndPasswordRequiredMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        new Error(UserNotFoundMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return errorResponse(
        res,
        new Error(EmailPasswordMatchMessage),
        EmailPasswordMatchMessage,
        statusCodes.UNAUTHORIZED,
      );
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_TOKEN,
      { expiresIn: '12h' },
    );

    return successResponse(
      res,
      { accessToken },
      'Login Successful',
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
