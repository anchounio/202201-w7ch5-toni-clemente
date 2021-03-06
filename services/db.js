import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { taskCreator } from '../models/task.model.js';
import { userCreator } from '../models/user.model.js';

export async function mongoConnect() {
    const user = process.env.DBUSER;
    const password = process.env.DBPASSWD;
    let dbName;
    if (process.env.NODE_ENV === 'test') {
        dbName = process.env.TESTDBNAME;
    } else {
        dbName = process.env.DBNAME;
    }
    console.log('Connecting to', dbName);
    const uri = `mongodb+srv://${user}:${password}@cluster0.znp1w.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    return await mongoose.connect(uri);
}

export async function mongoDisconnect() {
    return mongoose.disconnect();
}

export async function installUsers(data, modelName = 'User') {
    const User = userCreator(modelName);
    const deleted = await User.deleteMany({});
    const result = await User.insertMany(data);
    return { result, deleted };
}

export async function installTasks(data, modelName = 'Task') {
    const Task = taskCreator(modelName);
    const deleted = await Task.deleteMany({});
    const result = await Task.insertMany(data);
    return { result, deleted };
}
