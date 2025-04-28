import userModel from './user.model.js';
import { getHashPassword } from '../../utils/password.utils.js';
import { userValidations } from '../../validators/user.validation.js';
import { userRegisterMessage } from '../../constants/responseMessages.js';
import { errorResponse, successResponse } from '../../utils/responseHandler.js';
import { statusCodes } from '../../constants/statusCodeMessages.js';

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
      return errorResponse(
        res,
        new Error(
          `Validation Error: ${error.details.map((detail) => detail.message).join(', ')}`,
        ),
        'Validation failed',
        statusCodes.VALIDATION_ERROR,
      );
    }

    const hashedPassword = await getHashPassword(password);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return successResponse(res, user, userRegisterMessage, statusCodes.SUCCESS);
  } catch (error) {
    next(error);
  }
};
