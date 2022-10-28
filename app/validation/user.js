import { body, validationResult } from 'express-validator';
import User from '../models/user';
import logger from '../utils/logger';

export const userChangePasswordValidation = [
	body('email', 'Email is required').notEmpty(),
	body('oldPassword', 'Previous password is required').notEmpty(),
	body('password', 'New password is required').notEmpty().isString().isLength({ min: 8, max: 16 }),
];

export const userChangeUsernameValidation = [
	body('email', 'email is required').notEmpty(),
	body('name', 'Username is required').notEmpty(),
];

export const userValidation = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
		return res.status(422).json({
			errors: extractedErrors,
		});
	}

	if (req.path === '/changepassword') {
		const { email, oldPassword: password } = req.body;
		logger.info(req.path);
		try {
			const user = await User.findOne({ email }).exec();
			if (!user) {
				return res.status(404).json(`Can not find user with email ${email}`);
			}
			const validUser = user.comparePassword(password);
			if (!validUser) {
				return res.status(403).json({
					errors: 'Please input correct old password.',
				});
			}
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}

	if (req.path === '/changeusername') {
		const { email } = req.body;
		logger.info(req.path);
		try {
			const user = await User.findOne({ email }).exec();
			if (!user) {
				return res.status(404).json(`Can not find user with email ${email}`);
			}
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}

	return next();
};
