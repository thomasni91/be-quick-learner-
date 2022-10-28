import { Schema, model } from 'mongoose';

/**
 * @swagger
 * components:
 *  schemas:
 *    Answer:
 *      type: object
 *      required:
 *        - questionId
 *          userId
 *          userAnswer
 *      properties:
 *        _id:
 *          type: string
 *          description: auto generated unique identifier by mongoDB
 *        question:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Question'
 *        creator:
 *          type: string
 *          description: user reference id
 *        userAnswer:
 *          type: object
 *          description: the quiz answers of users
 *      example:
 *        _id: 61fa3427f8c33d52d5066468
 *        question: 61ef9c794c3f77ec28a04c16
 *        creator: 61fa4a95d9fbea8a123451af
 *        userAnswer:
 *          - a
 *          - c
 */
const answerSchema = new Schema(
	{
		question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
		creator: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		userAnswer: { type: Array, required: true },
	},
	{ timestamps: { createdAt: 'created', updatedAt: 'updated' } },
);

const Answer = model('Answer', answerSchema);
export default Answer;
