import QuizType from '../models/quizTypes';
import Quiz from '../models/quiz';

/**
 * @swagger
 * /quizType:
 *  get:
 *    summary: return all quiz types
 *    tags: [QuizTypes]
 *    parameters:
 *      - name: description
 *        in: query
 *        description: filter quiz types by description
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: array of quiz types
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/QuizType'
 */

export async function getAllQuizType(req, res) {
	try {
		const quizType = await QuizType.find({});
		return res.status(200).json(quizType);
	} catch (error) {
		return res.status(500).json(error);
	}
}

export async function getPopularQuizType(req, res) {
	try {
		const popularType = await Quiz.aggregate([
			{ $unwind: '$quizTypes' },
			{
				$group: {
					_id: '$quizTypes',
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
			{ $lookup: { from: 'quiztypes', localField: '_id', foreignField: '_id', as: 'quiztype' } },
			{ $limit: 5 },
		]);
		return res.status(200).json({ popularType });
	} catch (error) {
		return res.status(500).json(error);
	}
}

/**
 * @swagger
 * /quizType:
 *   post:
 *    summary: Create a new quiz type
 *    tags: [QuizTypes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#components/schemas/QuizType'
 *          example:
 *              name: math
 *    responses:
 *      201:
 *        description: The quiz type successfully added
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/QuizType'
 *
 */

export async function addQuizType(req, res) {
	try {
		const quizType = await QuizType.create(req.body);
		return res.status(201).json(quizType);
	} catch (error) {
		return res.status(500).json(error);
	}
}

/**
 * @swagger
 * /quizType/{id}:
 *   get:
 *    summary: Get quiz type by id
 *    tags: [QuizTypes]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: quiz type id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The task by id
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/QuizType'
 *      404:
 *        description:  quiz type not found
 *
 */

export async function GetQuizTypeById(req, res) {
	try {
		const quizType = await QuizType.findOne({ _id: req.params.id });
		if (!quizType) {
			return res.status(404).json({ message: `No quiz type with ID: ${req.params.id}` });
		}
		return res.status(200).json(quizType);
	} catch (error) {
		return res.status(500).json(error);
	}
}

/**
 * @swagger
 * /quizType/{id}:
 *   delete:
 *    summary: Delete a quiz type by id
 *    tags: [QuizTypes]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: task id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: quiz type deleted successfully
 *      404:
 *        description: quiz type not found
 *
 */

export async function deleteQuizTypeById(req, res) {
	try {
		const quizType = await QuizType.findOneAndDelete({ _id: req.params.id });
		if (!quizType) {
			return res.status(404).json({ message: 'quiz type id not found' });
		}
		await Quiz.updateOne({ quizTypes: quizType._id }, { $pull: { quizTypes: quizType._id } });
		return res.status(200).json({ message: 'quiz type deleted successfully' });
	} catch (error) {
		return res.status(500).json(error);
	}
}

/**
 * @swagger
 * /quizType/{id}:
 *   put:
 *    summary: Update a quiz type by id
 *    tags: [QuizTypes]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: task id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#components/schemas/QuizType'
 *          example:
 *              name: math
 *    responses:
 *      200:
 *        description: The quiz type successfully updated
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/QuizType'
 *      404:
 *        description: Task not found
 *
 */

export async function updateQuizTypeById(req, res) {
	try {
		const quizType = await QuizType.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!quizType) {
			return res.status(404).json({ message: `No quiz type with ID: ${req.params.id}` });
		}
		return res.status(200).json(quizType);
	} catch (error) {
		return res.status(500).json(error);
	}
}
