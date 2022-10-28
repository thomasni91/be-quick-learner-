import User from '../models/user';
import logger from '../utils/logger';
import Quiz from '../models/quiz';
import Answer from '../models/answer';
import TakeQuiz from '../models/takeQuiz';

/**
 * @swagger
 * /users/changepassword:
 *  post:
 *    summary: Change password with email and previous password
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              oldPassword:
 *                type: string
 *            required:
 *              - email
 *              - password
 *              - oldPassword
 *    responses:
 *      200:
 *        description: change password successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Password Update Success"
 *      403:
 *        description: authenticate fail
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Please input correct old password."
 *      404:
 *        description: user not exisit
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Can not find user with email"
 *      422:
 *        description: Incorrect request body format
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Email is required"
 */
export const changePassword = async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email }).exec();
		user.password = password;
		await user.save();
		user = await User.findOne({ email }).select('-password').exec();
		return res.status(200).json({ message: 'Password Update Success', user });
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const resetPassword = async (req, res) => {
	try {
		const userId = req.user.id;
		const { password } = req.body;
		let user = await User.findOne({ _id: userId }).exec();
		if (!user) {
			return res.status(404).json(`Can not find user with id ${userId}`);
		}
		if (password === user.email) {
			return res.status(404).json({ message: 'Password can not be same as your email address' });
		}
		user.password = password;
		await user.save();
		user = await User.findOne({ _id: userId }).select('-password').exec();
		return res.status(200).json({ message: 'Password reset success', user });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
/**
 * /users/changeusername:
 *  post:
 *    summary: Changeusername with email
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              name:
 *                type: string
 *            required:
 *              - email
 *              - name
 *    responses:
 *      200:
 *        description: change username successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Username Update Success"
 *      404:
 *        description: user not exist
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Can not find user with email"
 *      422:
 *        description: Incorrect request body format
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              errors: "Email is required"
 *              errors: "Username is required"
 */
export const changeUsername = async (req, res) => {
	const { email, name } = req.body;
	try {
		let user = await User.findOne({ email }).exec();
		user.name = name;
		await user.save();
		user = await User.findOne({ email }).select('-password').exec();
		return res.status(200).json({ message: 'Username Update Success', user });
	} catch (error) {
		return res.status(400).json(error);
	}
};

/**
 *@swagger
 * /users/:
 *  delete:
 *    summary: Delete a user
 *    tags: [User]
 *    description: Delete a user by id from token
 *    parameters:
 *    requestBody:
 *    responses:
 *      200:
 *        description: Email abc@abc.com deleted succssfully!!
 *      404:
 *        description: User not found!
 *      500:
 *        description: Internal Server Error!
 *
 */
export const deleteUser = async (req, res) => {
	const userId = req.user.id;
	try {
		const deletedUser = await User.findOneAndDelete({ _id: userId });
		if (!deletedUser) {
			return res.status(404).json({ error: 'User not found!' });
		}

		const deletedQuizzes = await Quiz.deleteMany({ creator: deletedUser._id });
		if (!deletedQuizzes) {
			return res.status(404).json({ error: 'Quiz not found!' });
		}

		const deletedTakeQuiz = await TakeQuiz.deleteMany({ takeQuizUser: deleteUser._id });
		if (!deletedTakeQuiz) {
			return res.status(404).json({ error: 'Take quiz history not found!' });
		}

		const deletedAnswer = await Answer.deleteMany({ creator: deleteUser._id });
		if (!deletedAnswer) {
			return res.status(404).json({ error: 'Answer not found!' });
		}

		return res.status(200).json({
			message: `Email ${deletedUser.email} and all created quizzes and answers deleted succssfully!`,
		});
	} catch (error) {
		logger.error(`${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
		return res.status(500).json({ error });
	}
};
