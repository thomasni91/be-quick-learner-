import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user';

/**
 * @swagger
 * /auth/signin:
 *  post:
 *    summary: Sign in with email and password
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
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: jwt token
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              token: "sjJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFD..."
 *      403:
 *        description: authenticate fail
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Authentication failed, please check your email and password"
 */
export async function signIn(req, res) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).exec();
		if (!user) {
			return res.status(404).json(`Can not find user with email ${email}`);
		}
		const id = user._id.toString();
		const validUser = user.comparePassword(password);
		if (validUser) {
			const { name, createdAt, verified } = user;
			if (!verified) {
				return res.status(403).json({ message: ' Authentication failed, please verified your email address' });
			}
			const token = jwt.sign({ id }, process.env.SECRET);
			return res.status(200).json({ token, name, createdAt, verified, id });
		}
		return res.status(403).json({
			message: 'Authentication failed, please check your email and password',
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * @swagger
 * /auth/signup-verify:
 *  post:
 *    summary: Verify email address when signup
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
 *            required:
 *              - email
 *    responses:
 *      200:
 *        description: email verify message
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: 'Email verified'
 *      404:
 *        description: can not find user
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Can not find user with email address"
 */
export async function signupEmailVerified(req, res) {
	try {
		const userId = req.user.id;
		const user = await User.findOne({ _id: userId }).exec();
		if (!user) {
			return res.status(404).json(`Can not find user with id ${userId}`);
		}
		await user.updateOne({ verified: true }).exec();
		return res.status(200).json({ message: 'Email verified' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
/**
 * @swagger
 * /auth/signup:
 *  post:
 *    summary: Sign up with email and password
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
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: sign up success message
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Sign Up Success"
 *      403:
 *        description: authenticate fail
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Authentication failed, please check your email and password"
 *      400:
 *        description: duplicate email
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              message: "Duplicate email"
 */
export async function signUp(req, res) {
	const { name, password, email } = req.body;
	const user = new User({ name, password, email });
	try {
		await user.save();
		return res.status(200).json({
			message: 'Please verify your email address in your mail box',
		});
	} catch (error) {
		// TODO - error handle
		if (error.code === 11000) {
			return res.status(400).json({ error: 'Duplicate email' });
		}

		return res.status(500).json({ error: error.message });
	}
}

/**
 * @swagger
 * /auth/me:
 *  get:
 *    summary: Get user info with jwt token
 *    tags: [User]
 *    responses:
 *      200:
 *        description: get username, email and verified information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                verified:
 *                  type: boolean
 *      401:
 *        description: Authenticate fail
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              error: "invalid token"
 *      404:
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *            example:
 *              error: "Can not find this user"
 */
export async function getUser(req, res) {
	try {
		const id = req.decoded?.id;
		const user = await User.findById({ id }).exec();
		if (!user) {
			return res.status(404).json({ error: 'Can not find this user' });
		}
		const { name, email, verified } = user;
		return res.status(200).json({ name, email, verified });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export async function googleAuth(req, res) {
	const { idToken } = req.body;
	try {
		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken,
		});
		const payload = ticket.getPayload();
		if (!payload.email_verified) {
			return res.status(404).json({ error: 'Incorrect email address' });
		}
		const user = await User.findOne({ email: payload.email }).exec();
		if (!user) {
			const newUser = new User({ name: payload.name, email: payload.email, password: ' ' });
			await newUser.save();
			const googleUser = await User.findOne({ email: payload.email }).exec();
			const id = googleUser._id.toString();
			const token = jwt.sign({ id }, process.env.SECRET);
			return res.status(200).json({ token, email: payload.email, name: payload.name, id });
		}
		const existGoogleUser = await User.findOne({ email: payload.email }).exec();
		const id = existGoogleUser._id.toString();
		const token = jwt.sign({ id }, process.env.SECRET);
		return res.status(200).json({ token, email: payload.email, name: payload.name, id });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}
