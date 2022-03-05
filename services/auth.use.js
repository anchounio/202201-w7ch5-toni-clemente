import { createToken, verifyToken } from './auth.js';

const user = {
    _id: '123a54b',
    name: 'Pepe',
};

const token = createToken(user);
console.log({ token });
console.log('Creado token');
console.log(verifyToken(token));
