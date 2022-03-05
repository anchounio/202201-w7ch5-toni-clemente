import request from 'supertest';
import { app, server } from '../index.js';
import { taskCreator } from '../models/task.model.js';
import { userCreator } from '../models/user.model.js';
import { createToken } from '../services/auth.js';
import data from '../services/task.data.js';

describe('Given the test database with a initial state', () => {
    // const collection = '';
    let Task;
    let authToken;
    let first_id;
    beforeEach(async () => {
        const User = userCreator();
        const mockUsers = await User.find({});
        const mockTasks = data.tasks.map((item, i) => {
            const index = i <= 1 ? i : 0;
            return { ...item, responsible: mockUsers[index]._id };
        });
        Task = taskCreator();
        await Task.deleteMany({});
        const result = await Task.insertMany(mockTasks);
        first_id = result[0].id;
        console.log(first_id);

        authToken = createToken({
            name: mockUsers[0].name,
            id: mockUsers[0].id,
        });
    });

    afterEach(() => {
        // connection.disconnect();
        server.close();
    });

    describe('When the request is GET /tasks with authentication', function () {
        test('responds with json', async function () {
            const response = await request(app)
                .get('/tasks')
                .set('Authorization', 'bearer ' + authToken);
            expect(response.statusCode).toBe(200);
        });
    });

    describe('When the request is GET /tasks without authentication', function () {
        test('responds with json', async function () {
            const response = await request(app).get('/tasks');
            expect(response.statusCode).toBe(401);
        });
    });

    describe('When the request is GET /tasks/:id with authentication', function () {
        test('responds with json', async function () {
            const response = await request(app)
                .get('/tasks/' + first_id)
                .set('Authorization', 'bearer ' + authToken);
            expect(response.statusCode).toBe(200);
        });
    });

    describe('When the request is GET /tasks/:id without authentication', function () {
        test('responds with json', async function () {
            const response = await request(app).get('/tasks/' + first_id);
            expect(response.statusCode).toBe(200);
        });
    });

    describe('DELETE /tasks', function () {
        // test('responds with json', async function () {
        //     const response = await request(app).delete('/tasks/12');
        //     expect(response.statusCode).toBe(406);
        // });
    });
});
