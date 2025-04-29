import Joi from 'joi';
import {
  emailRequiredMessage,
  emailValidationMessage,
  fullNameRequiredMessage,
  passwordRequiredMessage,
  strongPasswordValidationMessage,
} from '../constants/errorMessages.js';
import { emailRegex, passwordRegex } from '../constants/regexConstants.js';

export const userValidations = Joi.object({
  fullName: Joi.string().min(3).max(40).required(fullNameRequiredMessage),
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

export const loginValidations = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegex)).required().messages({
    'string.pattern.base': emailValidationMessage,
    'any.required': emailRequiredMessage,
  }),
  password: Joi.string().required().messages({
    'any.required': passwordRequiredMessage,
  }),
});
