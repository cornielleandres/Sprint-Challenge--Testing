const server = require('./server.js');
const request = require('supertest');
const db = require('../data/dbConfig.js');

describe('server.js', () => {
	describe('GET /games/', () => {
		it('should return status 200(OK)', async () => {
			const response = await request(server).get('/games/');
			expect(response.status).toBe(200);
		});

		it('should return JSON', async () => {
			const response = await request(server).get('/games/');
			expect(response.type).toBe('application/json');
		});

		it('should return the message "Server is running."', async () => {
			const response = await request(server).get('/games/');
			expect(typeof(response.body)).toBe('object');
			expect(response.body).toEqual({ message: 'Server is running.' });
		});
	});

	describe('GET /games/all', () => {
		it('should return status 200(OK)', async () => {
			const response = await request(server).get('/games/all');
			expect(response.status).toBe(200);
		});

		it('should return JSON', async () => {
			const response = await request(server).get('/games/all');
			expect(response.type).toBe('application/json');
		});

		it('should return list of all the games', async () => {
			const response = await request(server).get('/games/all');
			const expected = [
				{ 'id': 1, 'title': 'Pacman', 'genre': 'Arcade', 'releaseYear': 1980, },
				{ 'id': 2, 'title': 'Tetris', 'genre': 'Arcade', 'releaseYear': null, },
				{ 'id': 3, 'title': 'Dragon Quest', 'genre': 'RPG', 'releaseYear': null, },
			];
			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.length).toEqual(3);
			expect(response.body).toEqual(expected);
		});
	});

	describe('POST /games/', () => {
		describe('calling with all necessary info', () => {
			afterEach(() => db.migrate.rollback()
				.then(() => db.migrate.latest())
				.then(() => db.seed.run())
			);

			it('should return status 201(Created)', async () => {
				const response = await request(server).post('/games/');
				expect(response.status).toBe(201);
			});

			it('should return JSON', async () => {
				const response = await request(server).post('/games/');
				expect(response.type).toBe('application/json');
			});

			it('should return the newly inserted game', async () => {
				const newGame = { 'title': 'newGameTitle', 'genre': 'newGameGenre', 'releaseYear': 1990, };
				const response = await request(server).post('/games/').send(newGame);
				newGame[id] = 4;
				const expected = [ newGame ];
				expect(Array.isArray(response.body)).toBe(true);
				expect(response.body.length).toEqual(1);
				expect(response.body).toEqual(expected);
			});

			it('should return the newly inserted game with release year set to null', async () => {
				const newGame = { 'title': 'newGameTitle', 'genre': 'newGameGenre' };
				const response = await request(server).post('/games/').send(newGame);
				newGame[id] = 4;
				const expected = [ newGame ];
				expect(Array.isArray(response.body)).toBe(true);
				expect(response.body.length).toEqual(1);
				expect(response.body).toEqual(expected);
			});
		});

		describe('calling without all necessary info', () => {
			afterEach(() => db.migrate.rollback()
				.then(() => db.migrate.latest())
				.then(() => db.seed.run())
			);

			it('should return status 422(Unprocessable Entity (WebDAV))', async () => {
				const response = await request(server).post('/games/');
				expect(response.status).toBe(422);
			});

			it('should return JSON', async () => {
				const response = await request(server).post('/games/');
				expect(response.type).toBe('application/json');
			});

			it('should return an error message when genre is missing', async () => {
				const newGame = { 'title': 'newGameTitle' };
				const response = await request(server).post('/games/').send(newGame);
				const expected = { error: 'Game must have title and genre.' };
				expect(typeof(response.body)).toBe('object');
				expect(response.body).toEqual(expected);
			});

			it('should return an error message when title is missing', async () => {
				const newGame = { 'genre': 'newGameGenre' };
				const response = await request(server).post('/games/').send(newGame);
				const expected = { error: 'Game must have title and genre.' };
				expect(typeof(response.body)).toBe('object');
				expect(response.body).toEqual(expected);
			});
		});
	});
});
