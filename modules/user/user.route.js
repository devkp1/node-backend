import express from 'express';
import {
  getUserProfile,
  UserProfile,
  forgotPassword,
  loginUser,
  registerUser,
  requestCode,
  resetPassword,
  userInfo,
  verifyCode,
  logoutUser,
  authUser,
} from './user.controller.js';
import { isAuthenticateUser } from '../../middleware/validateTokenHandler.js';
import { verifyToken } from '../../middleware/verifyTokenHandler.js';
import upload from '../../config/imageConfig/multer.config.js';
const userRoute = express.Router();

userRoute.route('/auth').get(authUser);
userRoute.route('/register-user').post(registerUser);
userRoute.route('/signin').post(isAuthenticateUser, loginUser);
userRoute
  .route('/add-user-info')
  .put(isAuthenticateUser, verifyToken, userInfo);
userRoute
  .route('/request-code')
  .post(isAuthenticateUser, verifyToken, requestCode);
userRoute
  .route('/verify-code')
  .post(isAuthenticateUser, verifyToken, verifyCode);
userRoute
  .route('/reset-password')
  .put(isAuthenticateUser, verifyToken, resetPassword);
userRoute.route('/logout').post(isAuthenticateUser, verifyToken, logoutUser);
userRoute.route('/forgot-password').put(forgotPassword);
userRoute
  .route('/get-user')
  .get(isAuthenticateUser, verifyToken, getUserProfile);
userRoute
  .route('/update-profile')
  .put(
    isAuthenticateUser,
    verifyToken,
    upload.single('profilePicture'),
    UserProfile,
  );

export default userRoute;
