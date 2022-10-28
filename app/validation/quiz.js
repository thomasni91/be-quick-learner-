import { body, validationResult } from 'express-validator';
import Quiz from '../models/quiz';

export const quizAddValidation = [
	body('name', 'Name is required').notEmpty(),
	body('quizTypes', "Quiz types' quantities should between one to five").isArray({ min: 1, max: 5 }),
];

export const quizUpdateValidation = [
	body('name', 'Name is required').optional().notEmpty(),
	body('quizTypes', "Quiz types' quantities should between one to five").optional().isArray({ min: 1, max: 5 }),
	body('questions', 'Questions are required').optional().notEmpty(),
	body('private', 'Private is required').optional().notEmpty(),
	body('description', 'Description is required').optional(),
	body('timeLimit', 'TimeLimit is required').optional().notEmpty(),
];

export const quizValidation = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
		return res.status(422).json({
			errors: extractedErrors,
		});
	}

	if (req.method === 'PATCH' || req.method === 'DELETE') {
		const editor = req.user.id;
		try {
			const { creator } = await Quiz.findOne({ _id: req.params.id }, { creator: 1, _id: 0 }).exec();

			if (editor.toString() !== creator.toString()) {
				return res.status(422).json({
					errors: 'Only creator can edit this quiz.',
				});
			}
		} catch (error) {
			return res.status(404).json({
				errors: `No quiz with ID: ${req.params.id}`,
			});
		}
	}

	return next();
};
