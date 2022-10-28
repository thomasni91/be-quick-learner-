import mongoose from 'mongoose';
import Answer from '../models/answer';
/**
 * @swagger
 * /answer:
 *  post:
 *    summary: Create new answers
 *    tags: [Answer]
 *    parameters:
 *      schemas:
 *        type: object
 *    requestBody:
 *       required: true
 *       description: Creating answer object
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Answer'
 *    responses:
 *      201:
 *        description: array of answers with their question and user id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Answer'
 */
const addAnswer = async (req, res) => {
	const creator = req.user.id;
	const answers = req.body;
	const saveAnswerQueries = [];
	const saveAnswer = [];
	const failSavedQuestion = [];

	// eslint-disable-next-line no-restricted-syntax
	for (const question in answers) {
		if (Object.hasOwnProperty.call(answers, question)) {
			const element = answers[question];
			const { userAnswer } = element;
			const answer = new Answer({
				creator,
				question,
				userAnswer,
			});
			try {
				saveAnswerQueries.push(
					answer.save().then((savedDoc) => {
						saveAnswer.push(savedDoc);
					}),
				);
			} catch (error) {
				failSavedQuestion.push(question);
			}
		}
	}
	await Promise.all(saveAnswerQueries);
	if (failSavedQuestion.length !== 0) {
		return res.status(500).json({ message: 'Answer partly failed', data: failSavedQuestion });
	}
	return res.status(201).json({ message: 'Answer uploaded successfully', data: saveAnswer });
};

/**
 * @swagger
 * /answer:
 *  get:
 *    summary: Return a list of answers, includes question ,user details
 *    tags: [Answer]
 *    responses:
 *      200:
 *        description: array of answers
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Answer'
 */
const getAllAnswer = async (req, res) => {
	try {
		const allAnswers = await Answer.find().populate('question');
		return res.status(200).json(allAnswers);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * @swagger
 * /answer/{id}:
 *   get:
 *    summary: Get a answer by answer id
 *    tags: [Answer]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: answer id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: get the answer by id
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Answer'
 *      404:
 *        description: Answer not found
 *
 */
const getAnswerById = async (req, res) => {
	try {
		const answer = await Answer.findOne({ _id: req.params.id }).populate('creator').populate('question');
		if (!answer) {
			return res.status(404).json({ message: `no answer with ID: ${req.params.id}` });
		}
		return res.status(200).json({ answer });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * @swagger
 * /answer/users/{userId}:
 *   get:
 *    summary: Get answers by user id
 *    tags: [Answer]
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: user id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: get answers by userId
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Answer'
 *      404:
 *        description: Answer not found
 *
 */
const getAnswerHistoryByUserId = async (req, res) => {
	const userId = req.user.id;
	try {
		const answerHistory = await Answer.aggregate([
			{
				$match: { creator: new mongoose.Types.ObjectId(userId) },
			},
			{
				$match: {
					$expr: {
						$eq: [{ $year: '$updated' }, new Date().getFullYear()],
					},
				},
			},
			{
				$group: {
					_id: { $substr: [{ $toString: '$updated' }, 0, 10] },
					value: { $sum: 1 },
				},
			},
		]);
		if (!answerHistory) {
			return res.status(404).json({ message: `no answer record with userID: ${req.params.userId}` });
		}
		return res.status(200).json(answerHistory);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * @swagger
 * /answer/users/{userId}/questions/{questionId}:
 *   get:
 *    summary: Get answers by user id and question id
 *    tags: [Answer]
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: user id
 *        required: true
 *        schema:
 *          type: string
 *      - name: questionid
 *        in: path
 *        description: question id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: get answers by userId and question id
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Answer'
 *      404:
 *        description: Answer not found
 *
 */
const getAnswerByQuestionIdAndUserId = async (req, res) => {
	try {
		const answers = await Answer.find({ question: req.params.questionId, creator: req.params.userId }).populate(
			'question',
		);
		if (!answers) {
			return res.status(404).json({ message: `no answer record with questionID: ${req.params.questionId}` });
		}
		return res.status(200).json({ answers });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 * @swagger
 * /answer/{id}:
 *   put:
 *    summary: Update a answer by id
 *    tags: [Answer]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: quiz id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              creator:
 *                type: string
 *              question:
 *                type: string
 *              userAnswer:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *      200:
 *        description: The answer is successfully updated
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Answer'
 *      404:
 *        description: Answer not found
 *
 */
const updateAnswerById = async (req, res) => {
	try {
		const { creator, question, userAnswer } = req.body;
		const updatedAnswer = await Answer.findOneAndUpdate(
			{ _id: req.params.id },
			{
				creator,
				question,
				userAnswer,
			},
			{ new: true },
		);
		if (!updatedAnswer) {
			return res.status(404).json({ message: `no answer with ID: ${req.params.id}` });
		}
		return res.status(200).json({ updatedAnswer, message: `Update answer with ID ${req.params.id} Successfully` });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

/**
 *@swagger
 * /answer/{id}:
 *  delete:
 *    summary: Delete a answer
 *    tags: [Answer]
 *    description: Returns answer by answer id
 *    parameters:
 *      - name: "id"
 *        in: path
 *        description: Id of answer
 *        required: true
 *        schema:
 *          type: objectId
 *    responses:
 *      200:
 *        description: Answer deleted successfully!
 *      404:
 *        description: Answer not found.
 *
 */
const deleteAnswerById = async (req, res) => {
	try {
		const deletedAnswer = await Answer.findOneAndDelete({ _id: req.params.id }).exec();
		if (!deletedAnswer) {
			return res.status(404).json({ message: `no answer with ID: ${req.params.id}` });
		}
		return res.status(200).json({ deletedAnswer, message: `Delete answer with ID ${req.params.id} Successfully` });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export {
	addAnswer,
	getAnswerById,
	getAllAnswer,
	updateAnswerById,
	deleteAnswerById,
	getAnswerHistoryByUserId,
	getAnswerByQuestionIdAndUserId,
};
