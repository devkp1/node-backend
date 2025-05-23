import userModel from './user.model.js';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { successResponse, errorResponse } from '../../utils/responseHandler.js';
import {
  getHashPassword,
  comparePassword,
} from '../../utils/password.utils.js';
import {
  forgotPasswordValidations,
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
  EmailUniqueMessage,
  InvalidOrExpireOTP,
  UserInfoRequiredMessage,
  PasswordNotMatch,
  IncorrectCurrentPassword,
  PassswordShouldNotSame,
} from '../../constants/errorMessages.js';
import {
  CodeSentMessage,
  CodeVerifiedSuccessfully,
  PasswordResetSuccessMessage,
  UserRegisterMessage,
  UserLoginMessage,
  UserDataAddedSccuessfully,
  UserDataUpdatedSuccessfully,
  UserDetailsGetSuccessfully,
  LogoutSuccessMessage,
} from '../../constants/responseMessages.js';
import { statusCodes } from '../../constants/statusCodeMessages.js';
import { validateInput } from '../../common/validation.js';
import { generateAccessToken } from '../../utils/tokenGenerator.js';
import logger from '../../logger.js';
import { validateAllowedFields } from '../../utils/checkAllowedFields.js';
import { generateOTP, sendOTPEmail } from '../../utils/otp.utils.js';
import { checkUserExists } from '../../utils/checkUserExists.js';
import { uploadProfilePicture } from '../../utils/uploadProfilePicture.js';
import { blacklistedToken } from '../../utils/tokenManager.js';
import { checkCityStateCountryValidity } from '../../utils/checkCityStateCountryValidity.js';
import { verifyUser } from '../../utils/verifyUser.js';

export const authUser = async (req, res) => {
  const { fullName } = req.query;
  try {
    const foundUser = await verifyUser(fullName);
    if (!foundUser) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        NotFoundErrorMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const token = generateAccessToken(res, foundUser);
    return successResponse(res, token, statusCodes.SUCCESS);
  } catch (error) {
    logger.error(`authUser error.......... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

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
      UserRegisterMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    if (error.code === 11000 && error.keyValue.email) {
      logger.error(`Registration error: ${EmailUniqueMessage}`);
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        EmailUniqueMessage,
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
    const { email, newPassword } = req.body;

    const allowedFields = ['email', 'password'];
    if (!validateAllowedFields(allowedFields, req.body, res)) return next();

    const isValid = validateInput(
      loginValidations,
      { email, newPassword },
      res,
    );

    if (!isValid) return;

    if (!email || !newPassword) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        EmailAndPasswordRequiredMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    if (!validateInput(forgotPasswordValidations, { newPassword }, res)) return;

    const user = await userModel.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        UserNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const isPasswordMatch = await comparePassword(newPassword, user.password);

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
      UserLoginMessage,
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

    let user = await checkUserExists(userId, res);
    if (!user) return;

    user.gender = gender;
    user.dob = moment(dob).format('DD/MM/YYYY');
    user.houseNumber = houseNumber;
    user.address = address;
    user.pincode = pincode;
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
      UserDataAddedSccuessfully,
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

export const UserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      fullName,
      phoneNumber,
      email,
      countryCode,
      gender,
      dob,
      city,
      state,
      country,
    } = req.body;

    const isValid = validateInput(
      UserUpdateValidations,
      { fullName, email },
      res,
    );
    if (!isValid) return;

    let user = await checkUserExists(userId, res);
    if (!user) return;

    const validationResponse = await checkCityStateCountryValidity(
      city,
      state,
      country,
      res,
    );
    if (!validationResponse) return;

    // eslint-disable-next-line
    const { cityDetails, stateDetails, countryDetails } = validationResponse;

    try {
      user = await userModel.findByIdAndUpdate(
        userId,
        {
          phoneNumber,
          fullName,
          email,
          countryCode,
          gender,
          dob,
          city,
          state,
          country,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        },
      );

      let profilePicture = user.profilePicture;

      if (req.file) {
        const newProfilePictureUrl = await uploadProfilePicture(req.file, res);
        if (newProfilePictureUrl) {
          profilePicture = new newProfilePictureUrl();
        } else {
          return;
        }
      }

      user = await user.populate([
        { path: 'city', select: 'name' },
        { path: 'state', select: 'name' },
        { path: 'country', select: 'phoneCode name' },
      ]);

      if (!user.city || !user.state || !user.country) {
        return errorResponse(
          res,
          new Error(NotFoundErrorMessage),
          UserInfoRequiredMessage,
          statusCodes.NOT_FOUND,
        );
      }

      const updatedUser = {
        id: userId,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        gender: user.gender,
        profilePicture: profilePicture,
        dob: moment(user.dob).format('DD/MM/YYYY'),
        city: {
          id: user.city._id,
          cityName: user.city.name,
        },
        state: {
          id: user.state._id,
          stateName: user.state.name,
        },
        country: {
          id: user.country._id,
          countryName: user.country.name,
          countryCode: user.country.phoneCode,
        },
      };

      await user.save();

      return successResponse(
        res,
        updatedUser,
        UserDataUpdatedSuccessfully,
        statusCodes.SUCCESS,
      );
    } catch (error) {
      if (error.code === 110000 && error.keyPattern && error.keyPattern.email) {
        return errorResponse(
          res,
          new Error(EmailUniqueMessage),
          EmailUniqueMessage,
          statusCodes.VALIDATION_ERROR,
        );
      }

      throw error;
    }
  } catch (error) {
    logger.error(`UserProfile error: ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};

export const requestCode = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await userModel.findOne({ email: userEmail });
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
    return successResponse(res, otp, CodeSentMessage, statusCodes.SUCCESS);
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

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || user.code != code || moment().isAfter(user.otpExpires)) {
      return errorResponse(
        res,
        new Error(InvalidOrExpireOTP),
        InvalidOrExpireOTP,
        statusCodes.UNAUTHORIZED,
      );
    }

    user.code = undefined;
    user.otpExpires = undefined;
    user.isOTPVerified = true;
    await user.save();

    return successResponse(
      res,
      undefined,
      CodeVerifiedSuccessfully,
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
      PasswordResetSuccessMessage,
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

    if (newPassword === currentPassword) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        PassswordShouldNotSame,
        statusCodes.VALIDATION_ERROR,
      );
    }

    if (newPassword !== confirmNewPassword) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        PasswordNotMatch,
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
        IncorrectCurrentPassword,
        statusCodes.UNAUTHORIZED,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return successResponse(
      res,
      undefined,
      PasswordResetSuccessMessage,
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

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await checkUserExists(userId, res);
    if (!user) return;

    const userDetails = await userModel
      .findById(
        userId,
        'fullName countryCode phoneNumber email gender dob city country profilePicture',
      )
      .populate([
        { path: 'city', select: 'name' },
        { path: 'state', select: 'name' },
        { path: 'country', select: 'phoneCode' },
      ]);

    if (!userDetails.city || !userDetails.state || !userDetails.country) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        UserInfoRequiredMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const formattedUser = {
      id: userId,
      fullName: userDetails.fullName,
      phoneNumber: userDetails.phoneNumber,
      email: userDetails.email,
      dob: moment(userDetails.dob).format('DD/MM/YYYY'),
      gender: userDetails.gender,
      profilePicture: userDetails.profilePicture,
      city: {
        id: userDetails.city._id,
        cityName: userDetails.country.phoneCode,
      },
      state: {
        id: user.state._id,
        stateName: userDetails.state.name,
      },
      country: {
        id: userDetails.country._id,
        phoneCode: userDetails.country.phoneCode,
      },
    };

    return successResponse(
      res,
      formattedUser,
      UserDetailsGetSuccessfully,
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

export const logoutUser = async (req, res) => {
  try {
    const token = req.token;

    await blacklistedToken(token);

    return successResponse(
      res,
      undefined,
      LogoutSuccessMessage,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`logoutUser error......... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
