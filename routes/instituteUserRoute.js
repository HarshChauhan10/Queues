import express from 'express';
import { registerInstitute, completeProfile, loginInstituteUser, showdataEmailName, showDataExceptEmailName, updateProfileExceptEmailName, updateApproxTimePerPerson } from '../controllers/instituteUserController.js';
import authenticateUser from '../middleware/auth.js';

const router = express.Router();

// Route to register a new institute user
router.post('/register', registerInstitute);

// Route to log in an institute user
router.post('/login', loginInstituteUser);

// Route to complete the profile, protected with authentication middleware
router.post('/completeProfile', authenticateUser, completeProfile);

// Route to show email and name
router.get('/email-name', authenticateUser, showdataEmailName);

// Route to fetch all user data except name and email (protected)
router.get("/data-except-email-name", authenticateUser, showDataExceptEmailName);

// Route to update all user fields except name and email (protected)
router.put("/update-profile", authenticateUser, updateProfileExceptEmailName);

// **New Route for updating approxTimePerPerson**
router.patch('/update-approx-time', authenticateUser, updateApproxTimePerPerson); // PATCH request for partial update

export default router;
