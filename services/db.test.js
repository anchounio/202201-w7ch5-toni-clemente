import * as dotenv from 'dotenv';
dotenv.config();
import {
    mongoConnect,
    mongoDisconnect,
    installTasks,
    installUsers,
} from './db.js';
import data from './task.data.js';

describe('given a connection with MongoDB', () => {
    afterEach(async () => {
        await mongoDisconnect();
    });

    test('then should be possible connect to our DB ', async () => {
        const connect = await mongoConnect();
        expect(connect).toBeTruthy();
        expect(connect.connections[0].name).toBe(
            process.env.NODE_ENV === 'test'
                ? process.env.TESTDBNAME
                : process.env.DBNAME
        );
    });

    test('then it should be created and populated', async () => {
        await mongoConnect();
        // const { Task, connection } = await taskCreator(modelName);
        const mockUsers = data.users;
        const { result: users } = await installUsers(mockUsers);
        const mockTasks = data.tasks.map((item, i) => {
            const index = i <= 1 ? i : 0;
            return { ...item, responsible: users[index]._id };
        });
        const { result } = await installTasks(mockTasks);
        expect(result).toBeTruthy();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(data.tasks.length);
    });
});
