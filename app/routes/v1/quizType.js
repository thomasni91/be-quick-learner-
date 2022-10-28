import express from 'express';
import {
	getAllQuizType,
	getPopularQuizType,
	GetQuizTypeById,
	addQuizType,
	deleteQuizTypeById,
	updateQuizTypeById,
} from '../../controllers/quizType';
import { quizTypeValidation, quizTypeValidate } from '../../validation/quizType';

const router = express.Router();

router.get('/', getAllQuizType);
router.get('/popular', getPopularQuizType);
router.get('/:id', GetQuizTypeById);

router.post('/', quizTypeValidation, quizTypeValidate, addQuizType);

router.delete('/:id', deleteQuizTypeById);

router.put('/:id', quizTypeValidation, quizTypeValidate, updateQuizTypeById);

export default router;
