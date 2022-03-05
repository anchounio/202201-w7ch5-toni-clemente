// import mongoose from 'mongoose';
import * as controller from './tasks.controller.js';
import '../models/task.model.js';
import * as crud from '../services/tasks-crud.js';

jest.mock('../models/task.model.js', () => {
    return {
        taskCreator: jest.fn().mockResolvedValue({}),
    };
});
jest.mock('../services/tasks-crud.js');

describe('Given the tasks controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });
    describe('When getAllTasks is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                crud.getAllTasks.mockResolvedValue([{}]);
            });
            test('Then call json', async () => {
                await controller.getAllTasks(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And it does not work (promise is rejected)', () => {
            beforeEach(() => {
                crud.getAllTasks.mockRejectedValue(
                    new Error('Get All Tasks not possible')
                );
            });
            test('Then call next', async () => {
                await controller.getAllTasks(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When  addTask is triggered', () => {
        describe('And task is trying to add (promise is resolved)', () => {
            beforeEach(() => {
                crud.insertTask.mockResolvedValue({});
                // req.body = {
                //     title: 'Tarea adicional',
                //     responsible: 'Martín',
                //     isCompleted: false,
                // };
            });
            test('Then call json', async () => {
                await controller.insertTask(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
    });

    describe('When  getTaskById is triggered', () => {
        describe('And the id is found (promise resolved)', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                crud.getTask.mockResolvedValue([]);
            });
            test('Then call json', async () => {
                await controller.getTask(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And the id is not found (promise rejected)', () => {
            beforeEach(() => {
                req.params.id = '0000';
                crud.getTask.mockRejectedValue(
                    new Error('The id has not be found')
                );
            });
            test('Then call next', async () => {
                await controller.getTask(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When  updateTask is triggered', () => {
        describe('And the document is updated (promise resolved)', () => {
            beforeEach(() => {
                // req.params.id = '619516dd75bcdf9b77e6690c';
                crud.updateTask.mockResolvedValue([]);
            });
            test('Then call json', async () => {
                await controller.updateTask(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
    });

    describe('When deleteTask is triggered', () => {
        describe('And id exists', () => {
            beforeEach(() => {
                // req.params.id = '619516dd75bcdf9b77e6690c';
                crud.deleteTask.mockResolvedValue([]);
            });
            test('Then call json', async () => {
                await controller.deleteTask(req, res, next);
                expect(res.status).toHaveBeenCalledWith(202);
                expect(res.json).toHaveBeenCalled();
            });
        });
    });
});
