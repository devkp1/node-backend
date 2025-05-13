import {
  NotFoundErrorMessage,
  ServerErrorMessage,
  StateEmptyParameterMessage,
  StateNotFoundMessage,
  ValidationErrorMessage,
} from '../../../constants/errorMessages.js';
import { StateGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import State from '../models/stateModel.js';
import logger from '../../../logger.js';

export const getStatesByCountryCode = async (req, res) => {
  try {
    let { countryCode } = req.query;
    countryCode = countryCode.toUpperCase();
    if (!countryCode) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        StateEmptyParameterMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const query = {
      countryCode: countryCode.toUpperCase(),
    };

    const states = await State.find(query);

    if (states.length === 0) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        StateNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const formattedStates = states.map((state) => ({
      id: state._id,
      name: state.name,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    }));

    return successResponse(
      res,
      formattedStates,
      StateGetSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`getStatesByCountryCode error..... ${error.message}`);

    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
