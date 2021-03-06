import mongoose from 'mongoose';

export function userCreator(modelName = 'User') {
    const userSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        passwd: { type: String, required: true },
        // tasks: [
        //     {
        //         type: mongoose.Types.ObjectId,
        //         ref: 'Task',
        //     },
        //],
    });

    userSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
            delete returnedObject.passwd;
        },
    });

    let User;
    if (mongoose.default.models[modelName]) {
        User = mongoose.model(modelName);
    } else {
        User = mongoose.model(modelName, userSchema);
    }
    return User;
}

export const User = userCreator();
