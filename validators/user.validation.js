import Joi from 'joi';
import {
  emailRequiredMessage,
  emailValidationMessage,
  firstNameRequiredMessage,
  lastNameRequiredMessage,
  passwordRequiredMessage,
  strongPasswordValidationMessage,
} from '../constants/errorMessages.js';

const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=[\]{};:'",.<>?]).{8,20}$/;

export const userValidations = Joi.object({
  firstName: Joi.string().min(3).max(20).required(firstNameRequiredMessage),
  lastName: Joi.string().min(3).max(20).required(lastNameRequiredMessage),
  email: Joi.string().pattern(new RegExp(emailRegex)).required().messages({
    'string.pattern.base': emailValidationMessage,
    'any.required': emailRequiredMessage,
  }),
  password: Joi.string()
    .pattern(new RegExp(passwordRegex))
    .required()
    .messages({
      'string.pattrn.base': strongPasswordValidationMessage,
      'any.required': passwordRequiredMessage,
    }),
});
