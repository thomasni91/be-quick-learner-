import Quiz from '../models/quiz';
import TakeQuiz from '../models/takeQuiz';

/**
 * @swagger
 * /takeQuiz:
 *  post:
 *    summary: Create a new takeQuiz
 *    tags: [TakeQuiz]
 *    parameters:
 *      schemas:
 *        type: object
 *    requestBody:
 *       required: true
 *       description: Creating takeQuiz object
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/TakeQuiz'
 *    responses:
 *      200:
 *        description: Created takeQuiz object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TakeQuiz'
 */
export async function addTakeQuiz(req, res) {
	try {
		const takeQuizUser = req.user.id;
		const { quizid } = req.params;
		const { status, startTime, submitTime, userAnswer, questions } = req.body;
		const quiz = await Quiz.findById(quizid).exec();
		if (!quiz) {
			return res.status(404).json({ error: 'quiz not found' });
		}
		const newTakeQuiz = new TakeQuiz({
			status,
			startTime,
			submitTime,
			takeQuizUser,
			userAnswer,
			quiz: quiz._id,
			questions,
		});
		const addedTakeQuiz = await newTakeQuiz.save();
		await newTakeQuiz.populate('quiz');
		// link added takequiz to quiz
		quiz.played.addToSet(addedTakeQuiz._id);
		await quiz.save();
		return res.status(201).json({ newTakeQuiz });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /takeQuiz:
 *  get:
 *    summary: return a list of takeQuiz
 *    tags: [TakeQuiz]
 *    parameters:
 *      schemas:
 *        type: array
 *    responses:
 *      200:
 *        description: array of takeQuiz
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/TakeQuiz'
 */
export async function getAllTakeQuiz(req, res) {
	try {
		const allTakeQuiz = await TakeQuiz.find().populate('quiz').exec();
		return res.status(200).json(allTakeQuiz);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * @swagger
 * /takeQuiz/user:
 *  get:
 *    summary: Get TakeQuiz by user
 *    tags: [TakeQuiz]
 *    parameters:
 *      schemas:
 *        type: array
 *    responses:
 *      200:
 *        description: array of takeQuiz that is sorted newest with their quiz and takeQuizUser
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/TakeQuiz'
 *      404:
 *        description:  You haven't answer any quiz yet
 */
export async function getTakeQuizByUser(req, res) {
	try {
		const user = req.user.id;
		const takeQuizUser = await TakeQuiz.find({ takeQuizUser: user })
			.sort({ submitTime: 'desc' })
			.populate('quiz')
			.exec();
		if (!takeQuizUser) {
			return res.status(404).json({ message: `You haven't answer any quiz yet` });
		}
		return res.status(200).json(takeQuizUser);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * @swagger
 * /takeQuiz/{id}:
 *   get:
 *    summary: Get takeQuiz by id
 *    tags: [TakeQuiz]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: takeQuiz id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The takeQuiz by id
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/TakeQuiz'
 *      404:
 *        description:  TakeQuiz not found
 */
export async function getTakeQuizById(req, res) {
	try {
		const { id } = req.params;
		const takeQuiz = await TakeQuiz.findById(id);
		return res.status(200).json(takeQuiz);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /takeQuiz/{id}:
 *   delete:
 *    summary: Delete a takeQuiz by id
 *    tags: [TakeQuiz]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: takeQuiz id
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
 *            required:
 *              - creator
 *    responses:
 *      200:
 *        description: Delete takeQuiz successfully
 *      404:
 *        description:TakeQuiz not found.
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
export async function deleteTakeQuiz(req, res) {
	try {
		const { id } = req.params;
		const takeQuiz = await TakeQuiz.findByIdAndDelete(id).exec();
		if (!takeQuiz) {
			return res.status(404).json({ message: `No takeQuiz with ID: ${req.params.id}` });
		}
		return res
			.status(200)
			.json({ deleteTakeQuiz: takeQuiz, message: `Delete takeQuiz with ID ${req.params.id} Successfully ` });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
