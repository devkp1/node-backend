import Joi from 'joi';
import {
  EmailRequiredMessage,
  EmailValidationMessage,
  FullNameRequiredMessage,
  PasswordRequiredMessage,
  StrongPasswordValidationMessage,
} from '../constants/errorMessages.js';
import { emailRegex, passwordRegex } from '../constants/regexConstants.js';

export const userValidations = Joi.object({
  fullName: Joi.string().min(3).max(40).required(FullNameRequiredMessage),
  email: Joi.string().pattern(new RegExp(emailRegex)).required().messages({
    'string.pattern.base': EmailValidationMessage,
    'any.required': EmailRequiredMessage,
  }),
  password: Joi.string()
    .pattern(new RegExp(passwordRegex))
    .required()
    .messages({
      'string.pattrn.base': StrongPasswordValidationMessage,
      'any.required': PasswordRequiredMessage,
    }),
});

export const loginValidations = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegex)).required().messages({
    'string.pattern.base': EmailValidationMessage,
    'any.required': EmailRequiredMessage,
  }),
  password: Joi.string().required().messages({
    'any.required': PasswordRequiredMessage,
  }),
});

export const resetPasswordValidations = Joi.object({
  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base': StrongPasswordValidationMessage,
    'any.required': PasswordRequiredMessage,
  }),
  confirmNewPassword: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base': StrongPasswordValidationMessage,
    'any.required': PasswordRequiredMessage,
  }),
});

export const userUpdateValidatios = Joi.object({
  fullName: Joi.string().min(3).max(40).required(FullNameRequiredMessage),
  email: Joi.string().pattern(new RegExp(emailRegex)).required().messages({
    'string.pattern.base': EmailValidationMessage,
    'any.required': EmailRequiredMessage,
  }),
});

export const forgotPasswordValidations = Joi.object({
  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    'string.pattern.base': StrongPasswordValidationMessage,
    'any.required': PasswordRequiredMessage,
  }),
});
