import express from 'express';
const router = express.Router();

import {
    getAllTasks,
    getTask,
    insertTask,
    updateTask,
    deleteTask,
} from '../controllers/tasks.controller.js';

import { loginRequired, userRequired } from '../middlewares/interceptors.js';

/* GET users listing. */

router.get('/', loginRequired, getAllTasks);
router.get('/:id', getTask);
router.post('/', insertTask);
router.patch('/:id', loginRequired, userRequired, updateTask);
router.delete('/:id', loginRequired, userRequired, deleteTask);

export default router;

// module.exports = router;
