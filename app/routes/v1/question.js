import express from 'express';
import { createQuestion, deleteQuestionById, getQuestionById, updateQuestion } from '../../controllers/question';
import { questionCreateValidation, questionUpdateValidation, questionValidate } from '../../validation/question';
import { idValidation } from '../../validation/common';

const router = express.Router();
/**
 *@route   POST api/v1/question/
 *@desc    Create a question
 *@access  Private
 */
router.post('/', questionCreateValidation, questionValidate, createQuestion);

/**
 *@route   PATCH api/v1/question/:id
 *@desc    Update a question
 *@access  Private
 */
router.patch('/:id', idValidation, questionUpdateValidation, questionValidate, updateQuestion);

/**
 *@route   GET api/v1/question/:id
 *@desc    Get a question by ID
 *@access  Private
 */
router.get('/:id', idValidation, questionValidate, getQuestionById);

/**
 *@route   DELETE api/v1/question/:id
 *@desc    Delete a question by id
 *@access  Private
 */
router.delete('/:id', idValidation, questionValidate, deleteQuestionById);
export default router;
