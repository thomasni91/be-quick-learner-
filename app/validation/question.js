import { body, validationResult } from 'express-validator';
import Quiz from '../models/quiz';
import Question from '../models/question';
import logger from '../utils/logger';

export const questionCreateValidation = [
	body('title', 'Title is required').notEmpty(),
	body('choices', 'Answers is required').notEmpty(),
	body('correctAnswer', 'correctAnswer is required').notEmpty(),
];

export const questionUpdateValidation = [
	body('creator', 'Creator is required').notEmpty(),
	body('title', 'Title is required').optional().notEmpty(),
	body('choices', 'Answers is required').optional().notEmpty(),
	body('correctAnswer', 'correctAnswer is required').optional().notEmpty(),
];
export const questionDeleteValidation = [body('creator', 'Creator is required').notEmpty()];

export const questionValidate = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

		return res.status(422).json({
			errors: extractedErrors,
		});
	}

	if (req.method === 'PATCH' || req.method === 'DELETE') {
		const { id } = req.params;
		const { creator: editor } = req.body;
		try {
			await Question.findById(id);
		} catch (error) {
			return res.status(404).json({ message: `Question: ${id} not found!` });
		}
		try {
			const result = await Quiz.find(
				{ questions: { $elemMatch: { $eq: id } } },
				{
					creator: 1,
					name: 1,
					_id: 0,
				},
			).exec();
			const { creator } = result[0];
			if (result.length > 1) {
				logger.warn(`Warning: question ${id} has been cited by multiple quizzes!`);
			}
			if (editor.toString() !== creator.toString()) {
				return res.status(422).json({
					errors: 'Only creator can edit this quiz.',
				});
			}
		} catch (error) {
			return res.status(404).json({
				errors: `No creator with question: ${id}`,
			});
		}
	}

	return next();
};
