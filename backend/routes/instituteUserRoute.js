import express from 'express';
import { registerInstitute, completeProfile } from '../controllers/instituteUserController.js';
import auth from '../middleware/auth.js'; // Import the middleware

const router = express.Router();

// Route to register a new institute user
router.post('/register', registerInstitute);

// Route to complete the profile, protected with authentication middleware
router.post('/completeProfile', auth, completeProfile);

export default router;
