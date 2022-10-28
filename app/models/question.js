import { Schema, model } from 'mongoose';

/**
 *@swagger
 * components:
 *  schemas:
 *    Question:
 *      type: object
 *      required:
 *        - title
 *      properties:
 *        id:
 *          type: string
 *          description: auto generated unique identifier
 *        title:
 *          type: string
 *          description: question title
 *        choices:
 *          type: array
 *          items:
 *            type: string
 *          minItems: 1
 *          choice: answer
 *        correctAnswer:
 *          type: array
 *        type:
 *          type: string
 *          enum:
 *            - single selection
 *            - multi choice
 *            - fill in black
 *            - QA
 *      example:
 *        id: 61fa3427f8c33d52d5066468
 *        title: How many days in a year?
 *        choices:
 *          - 365
 *          - 360
 *          - 370
 *          - 366
 *        correntAnswer: 365
 *        type: single selection
 */

const questionSchema = new Schema(
	{
		title: { type: String },
		choices: { type: Array },
		correctAnswer: { type: Array },
		answerOptions: { type: Object },
		type: { type: String, enum: ['single selection', 'multi choice', 'QA', 'fill-in-blank', 'multiple-choice'] },
	},
	{ timestamps: true },
);

const Question = model('Question', questionSchema);
export default Question;
