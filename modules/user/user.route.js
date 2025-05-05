import express from 'express';
import { loginUser, registerUser } from './user.controller.js';
import { isAuthenticateUser } from '../../middleware/validateTokenHandler.js';
const userRoute = express.Router();

userRoute.route('/register-user').post(registerUser);
userRoute.route('/signin').post(isAuthenticateUser, loginUser);

export default userRoute;
