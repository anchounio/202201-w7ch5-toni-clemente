import express from 'express';
const router = express.Router();

import { insertUser, getAllUsers } from '../controllers/users.controller.js';

/* GET users listing. */

router.get('/', getAllUsers);
// router.get('/:id', getTask);
router.post('/', insertUser);
// router.patch('/:id', updateTask);
// router.delete('/:id', deleteTask);

export default router;

// module.exports = router;
