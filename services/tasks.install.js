import {
    installTasks,
    installUsers,
    mongoConnect,
    mongoDisconnect,
} from './db.js';
import data from './task.data.js';

mongoConnect()
    .then(() => installUsers(data.users))
    .then((userResult) => {
        const mockTasks = data.tasks.map((item, i) => {
            const index = i <= 1 ? i : 0;
            return { ...item, responsible: userResult.result[index]._id };
        });
        return installTasks(mockTasks);
    })
    .then((taskResult) => console.log(taskResult.result))
    .then(() => mongoDisconnect());
