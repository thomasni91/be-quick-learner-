import Quiz from '../models/quiz';
import Question from '../models/question';
import QuizType from '../models/quizTypes';
import TakeQuiz from '../models/takeQuiz';

const referralCodes = require('referral-codes');
const { ObjectId } = require('mongoose').Types;
/**
 * @swagger
 * /quiz:
 *  get:
 *    summary: return a list of quiz, includes questions ,quiz types details
 *    tags: [Quiz]
 *    parameters:
 *      schemas:
 *        type: array
 *    responses:
 *      200:
 *        description: array of quiz with their questions and quiz types
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Quiz'
 */
export async function getAllQuiz(req, res) {
	// const { page = 0, pageSize = 20 } = req.body;
	try {
		const allQuiz = await Quiz.find().populate('questions').populate('quizTypes');
		// .skip(page * pageSize)
		// .limit(pageSize);
		return res.status(200).json({ allQuiz });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /quiz/{id}:
 *   get:
 *    summary: Get quiz type by id or referral code
 *    tags: [Quiz]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: quiz id or referral code
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The quiz by id or referral code
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Quiz'
 *      404:
 *        description:  quiz not found
 */
export async function getQuizByInfo(req, res) {
	const { id } = req.params;

	try {
		let quiz = [];
		if (ObjectId.isValid(id)) {
			quiz = await Quiz.findOne({ _id: req.params.id }).populate('questions').populate('quizTypes');
		} else {
			quiz = await Quiz.findOne({ referralCode: { code: id.toString() } })
				.populate('questions')
				.populate('quizTypes')
				.exec();
		}

		if (!quiz) {
			return res.status(404).json({ message: 'Quiz not found' });
		}
		return res.status(200).json(quiz);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * @swagger
 * /quiz/user:
 *  get:
 *    summary: Get created quiz by user
 *    tags: [Quiz]
 *    parameters:
 *      schemas:
 *        type: array
 *    responses:
 *      200:
 *        description: array of quiz with their questions and quiz types
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Quiz'
 *      404:
 *        description:  You haven't create any quiz yet
 */
export async function getQuizByUser(req, res) {
	try {
		const user = req.user.id;
		const userQuiz = await Quiz.find({ creator: user }).populate('questions').populate('quizTypes').exec();
		if (!userQuiz) {
			return res.status(404).json({ message: `You haven't create any quiz yet` });
		}
		return res.status(200).json(userQuiz);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * @swagger
 * /quiz:
 *  post:
 *    summary: Create a new quiz
 *    tags: [Quiz]
 *    parameters:
 *      schemas:
 *        type: object
 *    responses:
 *      200:
 *        description: array of quiz with their questions and quiz types
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Quiz'
 */
export async function addQuiz(req, res) {
	try {
		const creator = req.user.id;
		const prefixGenerator = (name) => {
			let prefix = '';
			name.split(' ').forEach((element) => {
				prefix = prefix.concat(element.charAt(0));
			});
			return prefix.toUpperCase();
		};
		const code = referralCodes
			.generate({
				prefix: prefixGenerator(req.body.name),
				length: 4,
				count: 1,
				charset: referralCodes.charset('alphanumeric'),
				postfix: '2022',
			})
			.toString();
		const referralCode = { code };
		const newQuiz = await Quiz.create([{ ...req.body, creator, referralCode }], { runValidators: true });
		return res.status(201).json({ newQuiz });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /quiz/{id}:
 *   delete:
 *    summary: Delete a quiz by id
 *    tags: [Quiz]
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
 *            required:
 *              - creator
 *    responses:
 *      200:
 *        description: Delete quiz with ID 61fa13cc56724fc5edc7872e successfully
 *      404:
 *        description: No quiz with ID 61fa13cc56724fc5edc7872e
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
export async function deleteQuizById(req, res) {
	try {
		const deletedQuiz = await Quiz.findOneAndDelete({ _id: req.params.id });
		if (!deletedQuiz) {
			return res.status(404).json({ message: `No quiz with ID: ${req.params.id}` });
		}
		await Question.deleteMany({ _id: { $in: deletedQuiz.questions } }).exec();
		await TakeQuiz.deleteMany({ _id: { $in: deletedQuiz.played } }).exec();
		return res.status(200).json({
			deletedQuiz,
			message: `Delete quiz with ID ${req.params.id} Successfully `,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /quiz/{id}:
 *   patch:
 *    summary: Update a quiz by id
 *    tags: [Quiz]
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
 *              name:
 *                type: string
 *              questions:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Question'
 *              quizTypes:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/QuizType'
 *              description:
 *                type: string
 *                description: quiz description
 *              timeLimit:
 *                type: number
 *                description: time limited seconds number
 *            required:
 *              - creator
 *    responses:
 *      200:
 *        description: The quiz type successfully updated
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Quiz'
 *      404:
 *        description: Quiz not found
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
export async function updateQuiz(req, res) {
	try {
		const updatedQuiz = await Quiz.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
		})
			.populate('questions')
			.populate('quizTypes');
		return res.status(200).json({ message: 'Quiz edit successful', updatedQuiz });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /quiz/{quizid}/questions/{questionid}:
 *   post:
 *    summary: Add a question to quiz
 *    tags: [Quiz]
 *    parameters:
 *      - name: quizid
 *        in: path
 *        description: Id of quiz to update
 *        required: true
 *        schema:
 *          type: string
 *      - name: questionid
 *        in: path
 *        description: Question to be added
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Quiz'
 *      401:
 *        description:  UnAuthorized
 *      404:
 *        description:  Quiz not found or Question not found

 */
export async function addQuestionToQuiz(req, res) {
	try {
		const { quizid, questionid } = req.params;
		const quiz = await Quiz.findById(quizid).exec();
		if (!quiz) {
			return res.status(404).json({ error: 'quiz not found' });
		}
		const question = await Question.findById(questionid).exec();
		if (!question) {
			return res.status(404).json({ error: 'question not found' });
		}
		quiz.questions.addToSet(question._id);
		await quiz.save();
		return res.json(quiz);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /quiz/{quizid}/quiztypes/{quiztypeid}:
 *   post:
 *    summary: Add a quizType to quiz
 *    tags: [Quiz]
 *    parameters:
 *      - name: quizid
 *        in: path
 *        description: Id of quiz to update
 *        required: true
 *        schema:
 *          type: string
 *      - name: quiztypeid
 *        in: path
 *        description: QuizType to be added
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/Quiz'
 *      401:
 *        description:  UnAuthorized
 *      404:
 *        description:  Quiz not found or quizType not found
 */
export async function addQuizTypeToQuiz(req, res) {
	try {
		const { quizid, quiztypeid } = req.params;
		const quiz = await Quiz.findById(quizid).exec();
		if (!quiz) {
			return res.status(404).json({ error: 'quiz not found' });
		}
		const quizType = await QuizType.findById(quiztypeid).exec();
		if (!quizType) {
			return res.status(404).json({ error: 'quizType not found' });
		}
		quiz.quizTypes.addToSet(quizType._id);
		await quiz.save();
		return res.json(quiz);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
