import express from 'express';
import {
  loginUser,
  registerUser,
  updateUserGenderDob,
} from './user.controller.js';
import { isAuthenticateUser } from '../../middleware/validateTokenHandler.js';
import { verifyToken } from '../../middleware/verifyTokenHandler.js';
const userRoute = express.Router();

userRoute.route('/register-user').post(registerUser);
userRoute.route('/signin').post(isAuthenticateUser, loginUser);
userRoute
  .route('/update-gender-dob')
  .put(isAuthenticateUser, verifyToken, updateUserGenderDob);

export default userRoute;
