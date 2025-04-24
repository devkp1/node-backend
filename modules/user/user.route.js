import express from 'express';
import { registerUser } from './user.controller.js';
const userRoute = express.Router();

userRoute.route('/register-user').post(registerUser);

export default userRoute;
