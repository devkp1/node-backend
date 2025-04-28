import express from 'express';
import { loginUser, registerUser } from './user.controller.js';
const userRoute = express.Router();

userRoute.route('/register-user').post(registerUser);
userRoute.route('/signin').post(loginUser);

export default userRoute;
