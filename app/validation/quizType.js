import { body, validationResult } from 'express-validator';
import QuizType from '../models/quizTypes';

export const quizTypeValidation = [
	body('name', 'name is required')
		.notEmpty()
		.custom((value) =>
			// eslint-disable-next-line consistent-return
			QuizType.findOne({ name: value }).then((quizType) => {
				if (quizType) {
					return Promise.reject('quizType name already in use');
				}
			}),
		),
];

export const quizTypeValidate = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

		return res.status(422).json({
			errors: extractedErrors,
		});
	}

	return next();
};
