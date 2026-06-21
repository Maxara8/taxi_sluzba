import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    getUsers,
    getDrivers,
    deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers);
router.get('/drivers', protect, admin, getDrivers);
router.delete('/:id', protect, admin, deleteUser);

export default router;