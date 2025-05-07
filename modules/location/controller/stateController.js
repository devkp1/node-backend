import {
  NotFoundErrorMessage,
  ServerErrorMessage,
  StateEmptyParameterMessage,
  StateNotFoundMessage,
  ValidationErrorMessage,
} from '../../../constants/errorMessages.js';
import { stateGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import State from '../models/stateModel.js';
import logger from '../../../logger.js';

export const getStatesByCountryCode = async (req, res) => {
  try {
    let { countryCode } = req.params;
    countryCode = countryCode.toUpperCase();

    if (!countryCode) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        StateEmptyParameterMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const states = await State.find({ countryCode });

    if (states.length === 0) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        StateNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      states,
      stateGetSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`getSTatesByCountryCode error..... ${error.message}`);

    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
