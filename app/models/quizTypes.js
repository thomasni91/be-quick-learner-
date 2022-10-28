import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *  schemas:
 *    QuizType:
 *      type: object
 *      required:
 *        - description
 *      properties:
 *        id:
 *          type: string
 *          description: auto generated unique identifier
 *        name:
 *          type: string
 *          description: name of the quiz type
 *      example:
 *          id: "61fa13cc56724fc5edc7872e"
 *          name: math
 *
 */

const QuizTypeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'must provide name'],
		trim: true,
	},
});

const QuizType = mongoose.model('QuizType', QuizTypeSchema);
export default QuizType;
