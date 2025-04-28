import Joi from 'joi';
import {
  emailRequiredMessage,
  emailValidationMessage,
  firstNameRequiredMessage,
  lastNameRequiredMessage,
  passwordRequiredMessage,
  strongPasswordValidationMessage,
} from '../constants/errorMessages.js';
import { emailRegex, passwordRegex } from '../constants/regexConstants.js';

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
