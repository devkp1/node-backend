import Joi from 'joi';

const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=[\]{};:'",.<>?]).{8,20}$/;

export const userValidations = Joi.object({
  firstName: Joi.string().min(3).max(20).required(),
  lastName: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(new RegExp(emailRegex)).required().messages({
    'string.pattern.base': 'Please enter a valid email address',
    'any.required': 'Email is required.',
  }),
  password: Joi.string()
    .pattern(new RegExp(passwordRegex))
    .required()
    .messages({
      'string.pattrn.base':
        'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special characters.',
      'any.required': 'Password is required.',
    }),
});
