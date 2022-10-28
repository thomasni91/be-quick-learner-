import express from 'express';
import {
	addTakeQuiz,
	getAllTakeQuiz,
	getTakeQuizById,
	deleteTakeQuiz,
	getTakeQuizByUser,
} from '../../controllers/takeQuiz';
import { idValidation } from '../../validation/common';
import { takeQuizAddValidation, takeQuizValidation } from '../../validation/takeQuiz';

const router = express.Router();

router.get('/', getAllTakeQuiz);
router.get('/user', getTakeQuizByUser);
router.get('/:id', idValidation, takeQuizValidation, getTakeQuizById);
router.post('/:quizid', takeQuizAddValidation, takeQuizValidation, addTakeQuiz);
router.delete('/:id', idValidation, takeQuizValidation, deleteTakeQuiz);

export default router;
