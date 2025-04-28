import express from 'express';
import { loginUser, registerUser } from './user.controller.js';
import { isAuthenticateUser } from '../../middleware/validateTokenHandler.js';
const userRoute = express.Router();

userRoute.route('/register-user').post(isAuthenticateUser, registerUser);
userRoute.route('/signin').post(loginUser);

export default userRoute;
