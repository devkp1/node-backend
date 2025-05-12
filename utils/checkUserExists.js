import { UserNotFoundMessage } from '../constants/errorMessages.js';
import logger from '../logger.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import { errorResponse } from './responseHandler.js';
import userModel from '../modules/user/user.model.js';

export const checkUserExists = async (userId, res) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return errorResponse(
        res,
        new Error(UserNotFoundMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }
    return user;
  } catch (error) {
    logger.error(`checkUserExists error.......... ${error.message}`);
    return errorResponse(
      res,
      error,
      UserNotFoundMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
