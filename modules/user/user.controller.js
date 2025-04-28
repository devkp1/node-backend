import userModel from './user.model.js';
import { getHashPassword } from '../../utils/password.utils.js';
import { userValidations } from '../../validators/user.validation.js';
import { joiValidationMessage } from '../../constants/errorMessages.js';
import { userRegisterMessage } from '../../constants/responseMessages.js';

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const { error } = userValidations.validate({
      firstName,
      lastName,
      email,
      password,
    });

    if (error) {
      return res.status(500).json({
        status: false,
        message: joiValidationMessage,
        errors: error,
      });
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
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
