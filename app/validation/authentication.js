import { body } from 'express-validator';

export const signInValidate = [
	body('email').notEmpty().isEmail(),
	body('password').notEmpty().isString().isLength({ min: 8, max: 16 }),
];

export const signUpValidate = [
	body('email').notEmpty().isEmail(),
	body('password').notEmpty().isString().isLength({ min: 8, max: 16 }),
];
