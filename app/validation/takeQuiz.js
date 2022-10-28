import { body, validationResult } from 'express-validator';
import TakeQuiz from '../models/takeQuiz';

export const takeQuizAddValidation = [body('status', 'Status is required').notEmpty()];

export const takeQuizValidation = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
		return res.status(422).json({
			errors: extractedErrors,
		});
	}
	if (req.method === 'PATCH' || req.method === 'DELETE') {
		const { creator: editor } = req.user.id;
		try {
			const { creator } = await TakeQuiz.findOne({ _id: req.params.id }, { creator: 1, _id: 0 }).exec();
			if (editor.toString() !== creator.toString()) {
				return res.status(422).json({
					errors: 'Only creator can edit this takeQuiz.',
				});
			}
		} catch (error) {
			return res.status(404).json({
				errors: `No takeQuiz with ID: ${req.params.id}`,
			});
		}
	}
	return next();
};
