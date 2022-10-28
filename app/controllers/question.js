import Question from '../models/question';
import Quiz from '../models/quiz';
import logger from '../utils/logger';

/**
 * @swagger
 * /question:
 *  post:
 *    summary: Create a new question
 *    tags: [Question]
 *    parameters:
 *      schemas:
 *        type: object
 *    requestBody:
 *       required: true
 *       description: Creating question object
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Question'
 *    responses:
 *      200:
 *        description: Created question object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Question'
 */
const createQuestion = async (req, res) => {
	const { title, createdDate, updatedDate, choices, correctAnswer, answerOptions, type } = req.body;

	const question = new Question({
		title,
		createdDate,
		updatedDate,
		choices,
		correctAnswer,
		answerOptions,
		type,
	});
	try {
		await question.save();
		return res.status(201).json({ question, message: 'Question created successfully' });
	} catch (err) {
		return res.status(400).json(err);
	}
};

/**
 *@swagger
 * /question/{id}:
 *  get:
 *    summary: Get question by id
 *    tags: [Question]
 *    description: Returns a single question
 *    parameters:
 *      - name: "questionId"
 *        in: path
 *        description: ID of question
 *        required: true
 *        schema:
 *          type: objectId
 *    responses:
 *      200:
 *        description: array of tasks
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Question'
 *
 */
const getQuestionById = async (req, res) => {
	const { id } = req.params;
	try {
		const question = await Question.findById(id);
		return res.status(200).json(question);
	} catch (error) {
		logger.error(`${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		return res.status(500).json(error);
	}
};

/**
 *@swagger
 * /question/{id}:
 *  put:
 *    summary: Update a question by id
 *    tags: [Question]
 *    description: Returns a single question
 *    parameters:
 *      - name: "questionId"
 *        in: path
 *        description: ID of question
 *        required: true
 *        schema:
 *          type: objectId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              creator:
 *                type: string
 *              title:
 *                type: string
 *              choices:
 *                type: array
 *                items:
 *                  type: string
 *                minItems: 1
 *                choice: answer
 *              correctAnswer:
 *                type: string
 *              type:
 *                type: string
 *                description: quiz description
 *                enum:
 *                  - single selection
 *                  - multi choice
 *                  - fill in black
 *                  - QA
 *            required:
 *              - creator
 *    responses:
 *      201:
 *        description: Returns updated question object
 *        content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/Question'
 *      404:
 *        description: Question not found
 *      422:
 *        description: Incorrect request body format
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Creator is required"
 *
 */
const updateQuestion = async (req, res) => {
	const { title, create, choices, correctAnswer, answerOptions, type } = req.body;
	const { id } = req.params;
	const update = {
		title,
		create,
		choices,
		correctAnswer,
		answerOptions,
		type,
	};
	const filter = { _id: id };
	try {
		const newQuestion = await Question.findOneAndUpdate(filter, update, {
			new: true,
		});
		res.status(201).json({ newQuestion, message: 'Question updated successfully!' });
	} catch (err) {
		res.status(500).json(err);
		logger.error(`${err.status || 500}  - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
	}
};

/**
 *@swagger
 * /question/{id}:
 *  delete:
 *    summary: Delete a question
 *    tags: [Question]
 *    description: Returns a single question by Id
 *    parameters:
 *      - name: "questionId"
 *        in: path
 *        description: Id of question
 *        required: true
 *        schema:
 *          type: objectId
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              creator:
 *                type: string
 *            required:
 *              - creator
 *    responses:
 *      200:
 *        description: Question deleted successfully!
 *      404:
 *        description: Question not found.
 *      422:
 *        description: Incorrect request body format
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Creator is required"
 *
 */
const deleteQuestionById = async (req, res) => {
	const { id } = req.params;
	try {
		const deletedQuestion = await Question.findByIdAndDelete(id).exec();
		if (!deletedQuestion) {
			res.status(404).json({ message: 'Question not found!' });
			logger.error(`404 - Question not found! - ${req.originalUrl} - ${req.method} - ${req.ip}`);
			return;
		}
		await Quiz.updateOne({ questions: deletedQuestion._id }, { $pull: { questions: deletedQuestion._id } }).exec();
		res.status(200).json({ deletedQuestion, message: 'Question deleted successfully' });
	} catch (err) {
		logger.error(`${err.status || 500}  - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		res.status(500).json(err);
	}
};

export { createQuestion, getQuestionById, updateQuestion, deleteQuestionById };
