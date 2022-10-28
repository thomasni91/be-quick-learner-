import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../../app/app';
import Question from '../../../app/models/question';
import QuizType from '../../../app/models/quizTypes';
import Quiz from '../../../app/models/quiz';
import User from '../../../app/models/user';

const request = supertest(app);

describe('/question', () => {
	const token = jwt.sign('testing', process.env.SECRET);
	beforeAll(async () => {
		await mongoose.connect(global.__MONGO_URI__);
	});
	afterAll(async () => {
		await mongoose.connection.close();
	});
	beforeEach(async () => {
		await Question.deleteMany({});
		await Quiz.deleteMany({});
		await User.deleteMany({});
		await QuizType.deleteMany({});
	});
	describe('Create question', () => {
		it('should save the question if request is valid', async () => {
			const body = {
				title: 'test question',
				choices: '[choice1, choice2, choice3]',
				correctAnswer: 'test answer',
				type: 'single selection',
			};
			const response = await request.post('/api/v1/question').set('Authorization', `Bearer ${token}`).send(body);
			expect(response.status).toBe(201);
			const question = await Question.findOne(body).exec();
			expect(question).toBeTruthy();
		});

		it.each`
			field              | value
			${'title'}         | ${undefined}
			${'choices'}       | ${undefined}
			${'correctAnswer'} | ${undefined}
		`('should return express validator error if request is invalid', async ({ field, value }) => {
			const body = {
				title: 'test question',
				choices: '[choice1, choice2, choice3]',
				correctAnswer: 'test answer',
				type: 'single selection',
			};
			const invalidBody = { ...body, [field]: value };
			await request
				.post('/api/v1/question')
				.set('Authorization', `Bearer ${token}`)
				.send(invalidBody)
				.then((response) => {
					expect(response.statusCode).toBe(422);
				});
		});
	});

	describe('Get question by id', () => {
		it('should return the question with id', async () => {
			const question = await Question.create({
				title: 'test get question by id',
				choices: '[choice1, choice2, choice3]',
				correctAnswer: 'test answer',
				type: 'single selection',
			});
			await request
				.get(`/api/v1/question/${question.id}`)
				.set('Authorization', `Bearer ${token}`)
				.then((response) => {
					expect(response.status).toBe(200);
					expect(response.body._id).toBe(question.id);
				});
		});

		it('should return express validator error if id is invalid', async () => {
			const question = await Question.create({
				title: 'test get question by id',
				choices: '[choice1, choice2, choice3]',
				correctAnswer: 'test answer',
				type: 'single selection',
			});
			await request
				.get(`/api/v1/question/${question.id}1`)
				.set('Authorization', `Bearer ${token}`)
				.then((response) => {
					expect(response.status).toBe(422);
				});
		});
	});

	describe('Update question', () => {
		it('should update a question', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((response) => {
					expect(response.status).toBe(200);
				});
			const userLogin = await request.post(`/api/v1/auth/signin`).send(user);
			expect(userLogin.status).toBe(200);
			expect(userLogin.body.token).toBeTruthy();
			const type1 = { name: '1' };
			const quizType1 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type1);
			expect(quizType1.status).toBe(201);
			const type2 = { name: '1' };
			const quizType2 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type2);
			expect(quizType2.status).toBe(201);
			const questionCreate = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(questionCreate.status).toBe(201);
			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }, { _id: quizType2.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);
			const quizRefQuestion = await request
				.post(`/api/v1/quiz/${quizCreate._body.newQuiz[0]._id}/questions/${questionCreate._body.question._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			const updateQuestion = {
				title: 'updated question',
				choices: '[choice1, choice2, choice3]',
				correctAnswer: 'test answer',
				type: 'single selection',
				creator: quizRefQuestion._body.creator,
			};
			const response = await request
				.patch(`/api/v1/question/${questionCreate._body.question._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(updateQuestion);
			expect(response.status).toBe(201);
			const afterUpdateQuestion = await Question.findOne({ _id: questionCreate._body.question._id });
			expect(afterUpdateQuestion.title).toBe(updateQuestion.title);
		});

		it('should return express validator error if id is invalid', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((response) => {
					expect(response.status).toBe(200);
				});
			const userLogin = await request.post(`/api/v1/auth/signin`).send(user);
			expect(userLogin.status).toBe(200);
			expect(userLogin.body.token).toBeTruthy();
			const type1 = { name: '1' };
			const quizType1 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type1);
			expect(quizType1.status).toBe(201);
			const type2 = { name: '1' };
			const quizType2 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type2);
			expect(quizType2.status).toBe(201);
			const questionCreate = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(questionCreate.status).toBe(201);
			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }, { _id: quizType2.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);
			const quizRefQuestion = await request
				.post(`/api/v1/quiz/${quizCreate._body.newQuiz[0]._id}/questions/${questionCreate._body.question._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			const updateQuestion = {
				title: 'updated question',
				choices: '[choice1, choice2, choice3]',
				correctAnswer: 'test answer',
				type: 'single selection',
				creator: quizRefQuestion._body.creator,
			};
			const response = await request
				.patch(`/api/v1/question/${questionCreate._body.question._id}1`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(updateQuestion);
			expect(response.status).toBe(422);
		});

		it('should return express validator error if update question is invalid', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((response) => {
					expect(response.status).toBe(200);
				});
			const userLogin = await request.post(`/api/v1/auth/signin`).send(user);
			expect(userLogin.status).toBe(200);
			expect(userLogin.body.token).toBeTruthy();
			const type1 = { name: '1' };
			const quizType1 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type1);
			expect(quizType1.status).toBe(201);
			const type2 = { name: '1' };
			const quizType2 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type2);
			expect(quizType2.status).toBe(201);
			const questionCreate = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(questionCreate.status).toBe(201);
			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }, { _id: quizType2.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);
			const updateQuestion = null;
			const response = await request
				.patch(`/api/v1/question/${questionCreate._body.question._id}`)
				.set('Authorization', `Bearer ${token}`)
				.send(updateQuestion);
			expect(response.status).toBe(422);
		});
	});

	describe('Delete question by id', () => {
		it('should delete a question', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((response) => {
					expect(response.status).toBe(200);
				});
			const userLogin = await request.post(`/api/v1/auth/signin`).send(user);
			expect(userLogin.status).toBe(200);
			expect(userLogin.body.token).toBeTruthy();
			const type1 = { name: '1' };
			const quizType1 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type1);
			expect(quizType1.status).toBe(201);
			const type2 = { name: '1' };
			const quizType2 = await request
				.post(`/api/v1/quizType`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(type2);
			expect(quizType2.status).toBe(201);
			const questionCreate = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(questionCreate.status).toBe(201);
			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }, { _id: quizType2.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);
			const quizRefQuestion = await request
				.post(`/api/v1/quiz/${quizCreate._body.newQuiz[0]._id}/questions/${questionCreate._body.question._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			const questionCreator = { creator: quizRefQuestion._body.creator };
			await request
				.delete(`/api/v1/question/${questionCreate._body.question._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send(questionCreator)
				.then((res) => {
					expect(res.status).toBe(200);
				});
		});
	});
});
