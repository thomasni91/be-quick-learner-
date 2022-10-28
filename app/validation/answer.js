import { validationResult } from 'express-validator';
import User from '../models/user';
import Question from '../models/question';

const includes = (arr1, arr2) => arr2.every((val) => arr1.includes(val));

const answerValidate = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const extractedErrors = [];
		errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
		return res.status(422).json({
			errors: extractedErrors,
		});
	}

	const { creator, question, userAnswer } = req.body;
	try {
		const answerCreator = await User.findOne({ _id: creator }).exec();
		const answeredQuestion = await Question.findOne({ _id: question }).exec();
		if (!answerCreator) {
			return res.status(404).json({ error: 'creator not exist' });
		}
		if (!answeredQuestion) {
			return res.status(404).json({ error: 'question not exist' });
		}
		const { choices, type } = answeredQuestion;
		if (type === 'single selection') {
			if (userAnswer.length > 1) {
				return res.status(400).json({ error: 'you should only choose one option' });
			}
			if (!includes(choices, userAnswer)) {
				return res.status(404).json({ error: 'Your answer is not in the range of question options' });
			}
		} else if (type === 'multi choice') {
			if (!includes(choices, userAnswer)) {
				return res.status(404).json({ error: 'Your answer is not in the range of question options' });
			}
		}
	} catch (error) {
		return res.status(500).json(error);
	}
	return next();
};
export default answerValidate;
