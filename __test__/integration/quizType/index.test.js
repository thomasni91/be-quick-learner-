import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../../app/app';
import QuizType from '../../../app/models/quizTypes';

const request = supertest(app);

describe('Quiz Type', () => {
	const token = jwt.sign('testing', process.env.SECRET);

	beforeAll(async () => {
		await mongoose.connect(global.__MONGO_URI__);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	beforeEach(async () => {
		await QuizType.deleteMany({});
	});

	describe('GET /api/v1/quizType/:id', () => {
		it('should get the quiz type with ID', async () => {
			const quizType = await QuizType.create({
				name: 'test get by ID',
			});
			await request
				.get(`/api/v1/quizType/${quizType.id}`)
				.set('Authorization', `Bearer ${token}`)
				.expect(200)
				.then((response) => {
					expect(response.body._id).toBe(quizType.id);
					expect(response.body.name).toBe(quizType.name);
				});
		});
	});

	describe('GET /api/v1/quizType', () => {
		it('should get the quiz types', async () => {
			const quizType = await QuizType.create({
				name: 'test get all',
			});
			await request
				.get('/api/v1/quizType')
				.set('Authorization', `Bearer ${token}`)
				.expect(200)
				.then((response) => {
					expect(response.body.length).toEqual(1);
					expect(response.body[0]._id).toBe(quizType.id);
					expect(response.body[0].name).toBe(quizType.name);
				});
		});
	});

	describe('POST /api/v1/quizType', () => {
		it('should add a new quiz type', async () => {
			const data = {
				name: 'add a quiz type',
			};

			await request
				.post('/api/v1/quizType')
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.expect(201)
				.then(async (response) => {
					// Check the response
					expect(response.body._id).toBeTruthy();
					expect(response.body.name).toBe(data.name);
					// Check the data in the database
					const quizType = await QuizType.findOne({ _id: response.body._id });
					expect(quizType).toBeTruthy();
					expect(quizType.name).toBe(data.name);
				});
		});
	});

	describe('PUT /api/v1/quizType', () => {
		it('should update a quiz type', async () => {
			const quizType = await QuizType.create({
				name: 'update a quiz type 1',
			});

			const data = {
				name: 'update a quiz type 2',
			};

			await request
				.put(`/api/v1/quizType/${quizType.id}`)
				.set('Authorization', `Bearer ${token}`)
				.send(data)
				.expect(200)
				.then(async (response) => {
					// Check the response
					expect(response.body._id).toBe(quizType.id);
					expect(response.body.name).toBe(data.name);

					// Check the data in the database
					const newQuizType = await QuizType.findOne({ _id: response.body._id });
					expect(newQuizType).toBeTruthy();
					expect(newQuizType.name).toBe(data.name);
				});
		});
	});

	describe('DELETE /api/v1/quizType', () => {
		it('should delete a quiz type', async () => {
			const quizType = await QuizType.create({
				name: 'delete a quiz type',
			});

			await request
				.delete(`/api/v1/quizType/${quizType.id}`)
				.set('Authorization', `Bearer ${token}`)
				.expect(200)
				.then(async () => {
					expect(await QuizType.findOne({ _id: quizType.id })).toBeFalsy();
				});
		});
	});
});
