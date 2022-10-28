import express from 'express';
import {
	addAnswer,
	getAllAnswer,
	getAnswerHistoryByUserId,
	getAnswerByQuestionIdAndUserId,
	getAnswerById,
	updateAnswerById,
	deleteAnswerById,
} from '../../controllers/answer';
import { idValidation } from '../../validation/common';
import answerValidate from '../../validation/answer';

const router = express.Router();

router.post('/', addAnswer);

router.get('/', answerValidate, getAllAnswer);

router.get('/answer-history', getAnswerHistoryByUserId);

router.get('/:id', idValidation, answerValidate, getAnswerById);

router.put('/:id', idValidation, answerValidate, updateAnswerById);

router.delete('/:id', idValidation, answerValidate, deleteAnswerById);

router.get('/users/:userId/questions/:questionId', getAnswerByQuestionIdAndUserId);

export default router;
