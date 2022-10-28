import express from 'express';
import {
	getAllQuiz,
	getQuizByInfo,
	addQuiz,
	deleteQuizById,
	updateQuiz,
	addQuestionToQuiz,
	addQuizTypeToQuiz,
	getQuizByUser,
} from '../../controllers/quiz';
import { quizAddValidation, quizUpdateValidation, quizValidation } from '../../validation/quiz';
import { idValidation } from '../../validation/common';

const router = express.Router();

router.get('/', getAllQuiz);
router.get('/user', quizValidation, getQuizByUser);
router.get('/:id', quizValidation, getQuizByInfo);
router.post('/', quizAddValidation, quizValidation, addQuiz);
router.delete('/:id', idValidation, quizValidation, deleteQuizById);
router.patch('/:id', idValidation, quizUpdateValidation, quizValidation, updateQuiz);
router.post('/:quizid/questions/:questionid', addQuestionToQuiz);
router.post('/:quizid/quiztypes/:quiztypeid', addQuizTypeToQuiz);
export default router;
