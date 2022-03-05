import { userCreator } from '../models/user.model.js';

export async function getAllTasks(Task) {
    /* const { booksCollection, mongoClient } = await booksConnect();
    const cursor = booksCollection.find();
    const result = await cursor.toArray();
    mongoClient.close(); */
    return await Task.find({}).populate('responsible', {
        tasks: 0,
    });
}

export async function getTask(id, Task) {
    /*  const dbId = ObjectId(id);
    const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.findOne({ _id: dbId });
    mongoClient.close(); */
    return await Task.findById(id).populate('responsible', {
        tasks: 0,
    });
}

export async function insertTask(body, Task) {
    /* const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.insertOne(book);
    mongoClient.close(); */

    // body = {title, responsible, isCompleted}
    const User = userCreator();
    const user = await User.findById(body.responsible);
    if (!user) {
        return null;
    }
    const tempTask = await Task.create(body);
    const savedTask = await Task.findById(tempTask.id).populate('responsible', {
        tasks: 0,
    });

    // const result = await newTask.save(); incluido en create
    user.tasks = [...user.tasks, savedTask.id];
    user.save();
    return savedTask;
}

export async function updateTask(id, partialTask, Task) {
    /* const dbId = ObjectId(id);
    const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.findOneAndUpdate(
        { _id: dbId },
        {
            $set: { ...partialBook },
        }
    );
    mongoClient.close(); */
    return await Task.findByIdAndUpdate(id, partialTask, {
        new: true,
    }).populate('responsible', {
        tasks: 0,
    });
}

export async function deleteTask(id, Task) {
    /* const dbId = ObjectId(id);
    const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.findOneAndDelete({ _id: dbId });
    mongoClient.close(); */
    return await Task.findByIdAndDelete(id).populate('responsible', {
        tasks: 0,
    });
}
