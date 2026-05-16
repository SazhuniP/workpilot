import express from 'express';
import { getProjects, createProject, deleteProject } from '../controllers/projectController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getProjects);
router.post('/', auth, createProject);
router.delete('/:id', auth, deleteProject);

export default router;
