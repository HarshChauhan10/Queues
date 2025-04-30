import express from 'express';
import {
    registerUser,
    loginUser,
    completeUserProfile,
    getNameAndEmail,
    getProfileExceptNameEmail,
    updateProfileExceptNameEmail,
} from '../controllers/userController.js';

import authenticateUser from '../middleware/auth.js';

const router = express.Router();

// 🔐 Register a new user
router.post('/register', registerUser);

// 🔓 Log in an existing user
router.post('/login', loginUser);

// ✅ Complete user profile (gender + zipcode)
router.post('/complete-profile', authenticateUser, completeUserProfile);

// 👀 Get only name & email
router.get('/name-email', authenticateUser, getNameAndEmail);

// 📦 Get rest of profile (except name, email, password)
router.get('/profile', authenticateUser, getProfileExceptNameEmail);

// ✏️ Update profile (excluding name/email/password)
router.put('/update-profile', authenticateUser, updateProfileExceptNameEmail);

export default router;
