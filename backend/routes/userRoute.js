import express from 'express';
import {
    registerUser,
    loginUser,
    getUserData,
    updateUserData
} from '../controllers/userController.js';

import authenticateUser from '../middleware/auth.js';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to log in a user
router.post('/login', loginUser);

// Route to get full user data (protected)
router.get('/profile', authenticateUser, getUserData);

// Route to update user data (protected)
router.put('/update-profile', authenticateUser, updateUserData);

export default router;
