import { taskCreator } from './task.model.js';

describe('given a connection with MongoDB', () => {
    const collection = 'testingTasks';
    beforeAll(() => {});

    test('then should exist our Model ', async () => {
        const { Task, connection } = await taskCreator(collection);
        expect(connection.connections[0].name).toBe(process.env.DBNAME);
        expect(Task).toBeTruthy();
        expect(Task.modelName).toBe(collection);
        connection.disconnect();
    });
});
