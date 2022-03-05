import { Error, mongo } from 'mongoose';
import { mongoConnect, mongoDisconnect, installTasks } from './db.js';
import { taskCreator } from '../models/task.model.js';
import data from './task.data.js';
import * as tasksSrv from './tasks-crud.js';
import { userCreator } from '../models/user.model.js';

describe('given a connection with a MongoDB', () => {
    describe('when a collection is defined and populated', () => {
        let Task;
        let initialCount;
        let first_id;
        let invalid_id;
        let mockUsers;
        const collection = 'Task';
        beforeAll(async () => {
            await mongoConnect();
            const User = userCreator();
            mockUsers = await User.find({});
            const mockTasks = data.tasks.map((item, i) => {
                const index = i <= 1 ? i : 0;
                return { ...item, responsible: mockUsers[index]._id };
            });
            const { result: mockCollection } = await installTasks(mockTasks);
            // const mockCollection = await Task.find({});
            initialCount = mockCollection.length;
            first_id = mockCollection[0].id;
            invalid_id = '621a1603366d76fe79fbb93a';
            Task = taskCreator();
        });
        afterAll(async () => {
            await mongoDisconnect();
        });
        test('should connect to the collection', async () => {
            expect(Task).toBeTruthy();
            expect(Task.modelName).toBe(collection);
        });

        describe('and try to get all the items', () => {
            test('should get all of them', async () => {
                const result = await tasksSrv.getAllTasks(Task);
                expect(result.length).toBe(initialCount);
            });
        });

        describe('and try to get one item by id', () => {
            test('should find and get the item', async () => {
                const result = await tasksSrv.getTask(first_id, Task);
                expect(result).toHaveProperty('_id');
                expect(result.id).toBe(first_id);
                expect(result.title).toBe('Diseñar la Home');
            });
            test('should not find and get the item with invalid id', async () => {
                const result = await tasksSrv.getTask(invalid_id, Task);
                expect(result).toBe(null);
            });
            test('should not find and get the item with malformed id', async () => {
                await expect(
                    tasksSrv.getTask('0000', Task)
                ).rejects.toThrowError(Error.CastError);
            });
        });

        describe('and try to add a new item ', () => {
            test('should add a valid item', async () => {
                const newTask = {
                    title: 'Desplegar la Home',
                    responsible: mockUsers[0]._id,
                    isCompleted: false,
                };
                const result = await tasksSrv.insertTask(newTask, Task);
                expect(result).toHaveProperty('_id');
                expect(result.title).toBe('Desplegar la Home');
            });
            test('should not add a invalid item (required missing)', async () => {
                const newTask = {
                    responsible: mockUsers[0]._id,
                    isCompleted: false,
                };
                await expect(
                    tasksSrv.insertTask(newTask, Task)
                ).rejects.toThrowError(Error.ValidationError);
            });
            test('should not add a invalid item (not unity when required )', async () => {
                const newTask = {
                    title: 'Desplegar la Home',
                    responsible: mockUsers[0]._id,
                    isCompleted: false,
                };
                await expect(
                    tasksSrv.insertTask(newTask, Task)
                ).rejects.toThrowError(mongo.MongoServerError);
            });
        });

        describe('and try to update a item', () => {
            test('should update the item if id is valid', async () => {
                const partialTask = {
                    isCompleted: true,
                };
                const result = await tasksSrv.updateTask(
                    first_id,
                    partialTask,
                    Task
                );
                expect(result.title).toBe('Diseñar la Home');
                expect(result.isCompleted).toBe(true);
            });
            test('should not update the item if id is not valid', async () => {
                const result = await tasksSrv.updateTask(invalid_id, {}, Task);
                expect(result).toBe(null);
            });
        });
        describe('and try to delete a item', () => {
            test('should delete the item if id is valid', async () => {
                const result = await tasksSrv.deleteTask(first_id, Task);
                expect(result.id).toBe(first_id);
                const allTasks = await tasksSrv.getAllTasks(Task);
                // after insert one and delete one
                expect(allTasks.length).toBe(initialCount);
            });
            test('should not delete the item if id is not valid', async () => {
                const result = await tasksSrv.deleteTask(invalid_id, Task);
                expect(result).toBe(null);
            });
        });
    });
});
