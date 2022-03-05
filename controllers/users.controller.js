import bcrypt from 'bcryptjs';
import { createToken } from '../services/auth.js';
import { User } from '../models/user.model.js';
import { createError } from '../services/errors.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const resp = await User.find({}).populate('tasks', {
            responsible: 0,
        });
        res.json(resp);
    } catch (err) {
        next(createError(err, 404));
    }
};

export const insertUser = async (req, resp, next) => {
    try {
        const encryptedPasswd = bcrypt.hashSync(req.body.passwd);
        const userData = { ...req.body, passwd: encryptedPasswd };
        const newUser = new User(userData);
        const result = await newUser.save();
        const token = createToken({
            name: result.name,
            id: result.id,
        });
        resp.json({
            token,
            userName: result.name,
            id: result.id,
        });
    } catch (error) {
        next(createError(error));
    }
};
