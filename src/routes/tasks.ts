import express from 'express';
import { getTasks, createOriginalTask, updateTaskStatus } from '../controllers/taskController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getTasks);
router.post('/', auth, createOriginalTask);
router.patch('/:id', auth, updateTaskStatus);

export default router;
