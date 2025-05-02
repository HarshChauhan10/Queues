import express from "express";
import {
    joinQueue,
    leaveQueue,
    removeUserFromQueue,
    getQueuesForInstitute,
    moveUserToEnd,
    autoMoveUserToEnd
} from "../controllers/queueController.js";
import authenticateUser from '../middleware/auth.js';// Assuming JWT authentication middleware

const router = express.Router();

// Route for joining a queue
router.post("/join", authenticateUser, joinQueue);

// Route for leaving a queue
router.post("/leave", authenticateUser, leaveQueue);

// Route for removing a user from a queue (admin/institute only)
router.post("/remove", authenticateUser, removeUserFromQueue);

// Route to fetch all queues for a specific institute
router.get("/:instituteId", authenticateUser, getQueuesForInstitute);

// Route to manually move a user to the end of the queue (institute)
router.post("/move-to-end", authenticateUser, moveUserToEnd);

// Automatically move users to the end of the queue based on their window (should be a scheduled task, not manual)
router.post("/auto-move", authenticateUser, autoMoveUserToEnd);  // This route can be used for manual testing

export default router;
