import { Schema, model } from 'mongoose';

/**
 *@swagger
 * components:
 *  schemas:
 *    TakeQuiz:
 *      type: object
 *      required:
 *        - status
 *      properties:
 *        _id:
 *          type: string
 *          description: auto generated unique identifier
 *        status:
 *          type: boolean
 *          description: quiz finish status
 *        startTime:
 *          type: string
 *          description: start quiz time
 *        submitTime:
 *          type: string
 *          description: submit quiz time
 *        takeQuizUser:
 *          type: string
 *          description: user reference id
 *        quiz:
 *          type: string
 *          description: quiz id to be answer
 *        questions:
 *          type: Array
 *          description: quiz questions
 *        userAnser:
 *          type: object
 *          description: user answer
 *      example:
 *        id: "61fa3427f8c33d52d5066468"
 *        status: true
 *        startTime: "2022-02-02T10:05:56.476Z"
 *        submitTime: "2022-02-02T10:25:56.476Z"
 *        creator: 61ef9c794c3f77ec28a04c16
 *        quiz: 61fa13cc56724fc5edc7872e
 */

const takeQuizSchema = new Schema({
	status: { type: Boolean, required: true },
	startTime: { type: Date, default: Date.now },
	submitTime: { type: Date, default: Date.now },
	takeQuizUser: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
	questions: { type: Array, required: true, index: true },
	userAnswer: { type: Object, required: true, index: true },
});

const TakeQuiz = model('TakeQuiz', takeQuizSchema);
export default TakeQuiz;
