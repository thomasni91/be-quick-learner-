import mongoose, { Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *  schemas:
 *    Quiz:
 *      type: object
 *      required:
 *         - name
 *           creator
 *           questions
 *           quizTypes
 *      properties:
 *        _id:
 *          type: string
 *          description: auto generated unique identifier by mongoDB
 *        name:
 *          type: string
 *          description: name of the quiz
 *        date:
 *          type: string
 *          description: quiz creation date
 *        creator:
 *          type: string
 *          description: user reference id
 *        questions:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Question'
 *        quizTypes:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/QuizType'
 *        private:
 *          type: boolean
 *          description: quiz accessbility, default value is false
 *        description:
 *          type: string
 *          description: quiz description
 *        timeLimit:
 *          type: number
 *          description: time limited seconds number
 *      examples:
 *          id: "61fa13cc56724fc5edc7872e"
 *          name: Math quiz collection
 *          date: "2022-02-02T10:05:56.476Z"
 *          creator: "61ef9c794c3f77ec28a04c16"
 *          questions: ["61fa2e7579e7c60fdf91b365","61fa309fe84345f5045da6cf"]
 *          quizTypes:  ["61fa4a95d9fbea8a123451af"]
 *          private: false
 *
 */
const referralCodeSchema = new Schema(
	{
		code: { type: String, required: true },
		quantity: { type: Number, required: false, default: 10000 },
	},
	{ _id: false },
);

const quizSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true },
	date: { type: Date, default: Date.now },
	grade: { type: Number, required: true },
	creator: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
	quizTypes: [{ type: Schema.Types.ObjectId, ref: 'QuizType', required: true }],
	played: [{ type: Schema.Types.ObjectId, ref: 'TakeQuiz' }],
	difficulty: { type: String, enum: ['Hard', 'Medium', 'Easy'], required: true },
	description: { type: String, required: false },
	timeLimit: { type: Number, required: false },
	referralCode: referralCodeSchema,
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
