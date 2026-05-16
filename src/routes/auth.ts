import express from 'express';
import { signup, login, getProfile, getAllUsers } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.get('/users', auth, getAllUsers);

export default router;
