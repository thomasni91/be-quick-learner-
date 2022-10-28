import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../../app/app';
import Quiz from '../../../app/models/quiz';
import User from '../../../app/models/user';
import Question from '../../../app/models/question';
import QuizType from '../../../app/models/quizTypes';

const request = supertest(app);

describe('/quiz', () => {
	beforeAll(async () => {
		await mongoose.connect(global.__MONGO_URI__);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	beforeEach(async () => {
		await Question.deleteMany({});
		await QuizType.deleteMany({});
		await User.deleteMany({});
		await Quiz.deleteMany({});
	});

	describe('Add new quiz', () => {
		it('should add new quiz', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);
		});
	});
	describe('Get all the quiz', () => {
		it('should get all the quiz', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const allQuiz = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }, { _id: quizType2.body._id }],
					questions: [],
				});
			expect(allQuiz.status).toBe(201);

			const getAllQuiz = await request.get(`/api/v1/quiz`).set('Authorization', `Bearer ${userLogin.body.token}`);
			expect(getAllQuiz.status).toBe(200);
		});
	});
	describe('Get quiz by ID', () => {
		it('should get quiz by id', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);

			const getQuizById = await request
				.get(`/api/v1/quiz/${quizCreate._body.newQuiz[0]._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			expect(getQuizById.status).toBe(200);
		});
	});

	describe('Update quiz', () => {
		it('should update quiz', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const quiz = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [],
					description: 'This is the quiz',
					timeLimit: 30,
				});
			expect(quiz.status).toBe(201);

			const updatedQuiz = await request
				.patch(`/api/v1/quiz/${quiz._body.newQuiz[0]._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName2',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [{ _id: question._body.question._id }],
					private: true,
					description: 'This is the new quiz',
					timeLimit: 10,
				});
			expect(updatedQuiz.status).toBe(200);
			const updateQuizInDatabase = await Quiz.findOne({ _id: updatedQuiz._body.updatedQuiz._id });
			expect(updatedQuiz._body.updatedQuiz.description).toBe(updateQuizInDatabase.description);
		});
	});

	describe('Delect quiz by ID', () => {
		it('should delect quiz by id', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const quiz = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [],
				});
			expect(quiz.status).toBe(201);

			const delectedQuiz = await request
				.delete(`/api/v1/quiz/${quiz._body.newQuiz[0]._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			expect(delectedQuiz.status).toBe(200);
			expect(await Quiz.findOne({ _id: quiz._body.newQuiz[0]._id })).toBeFalsy();
		});
	});

	describe('Add question to quiz', () => {
		it('should add question to quiz', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);

			const quizRefQuestion = await request
				.post(`/api/v1/quiz/${quizCreate._body.newQuiz[0]._id}/questions/${question._body.question._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			expect(quizRefQuestion.status).toBe(200);
		});
	});

	describe('Add quiz type to quiz', () => {
		it('should add quiz type to quiz', async () => {
			const user = {
				name: 'testName',
				password: 'testPassword',
				email: 'testing@email.com',
			};
			await request
				.post(`/api/v1/auth/signup`)
				.send(user)
				.then((res) => {
					expect(res.status).toBe(200);
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

			const question = await request
				.post(`/api/v1/question`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					title: 'test update question by id',
					choices: '[choice1, choice2, choice3]',
					correctAnswer: 'test answer',
					type: 'single selection',
				});
			expect(question.status).toBe(201);

			const quizCreate = await request
				.post(`/api/v1/quiz`)
				.set('Authorization', `Bearer ${userLogin.body.token}`)
				.send({
					name: 'testingName',
					quizTypes: [{ _id: quizType1.body._id }],
					questions: [],
				});
			expect(quizCreate.status).toBe(201);

			const quizRefQuizType = await request
				.post(`/api/v1/quiz/${quizCreate._body.newQuiz[0]._id}/quizTypes/${quizType1.body._id}`)
				.set('Authorization', `Bearer ${userLogin.body.token}`);
			expect(quizRefQuizType.status).toBe(200);
		});
	});
});
