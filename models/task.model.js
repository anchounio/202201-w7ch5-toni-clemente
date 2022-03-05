import mongoose from 'mongoose';

export function taskCreator(modelName = 'Task') {
    const taskSchema = new mongoose.Schema({
        title: { type: String, required: true, unique: true },
        responsible: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        isCompleted: Boolean,
    });

    taskSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
        },
    });

    let Task;
    if (mongoose.default.models[modelName]) {
        Task = mongoose.model(modelName);
    } else {
        Task = mongoose.model(modelName, taskSchema);
    }
    return Task;
}
