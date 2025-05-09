import express from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  requestOTP,
  resetPassword,
  userInfo,
  verifyOTP,
} from './user.controller.js';
import { isAuthenticateUser } from '../../middleware/validateTokenHandler.js';
import { verifyToken } from '../../middleware/verifyTokenHandler.js';
const userRoute = express.Router();

userRoute.route('/register-user').post(registerUser);
userRoute.route('/signin').post(isAuthenticateUser, loginUser);
userRoute
  .route('/add-user-info')
  .put(isAuthenticateUser, verifyToken, userInfo);
userRoute
  .route('/request-otp')
  .post(isAuthenticateUser, verifyToken, requestOTP);
userRoute.route('/verify-otp').post(isAuthenticateUser, verifyToken, verifyOTP);
userRoute
  .route('/reset-password')
  .put(isAuthenticateUser, verifyToken, resetPassword);
userRoute.route('/logout').post(isAuthenticateUser, verifyToken, logoutUser);
export default userRoute;
