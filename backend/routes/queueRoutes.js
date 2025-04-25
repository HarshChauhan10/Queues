import express from "express";
import {
    joinQueue,
    getInstitutesWithQueueCount,
    getQueueStats,
    removeUserFromQueue,
    leaveQueue,
} from "../controllers/queueController.js";

import authenticateUser from '../middleware/auth.js';


const router = express.Router();

router.post("/join/:instituteId", authenticateUser, joinQueue);
router.get("/institutes", getInstitutesWithQueueCount);
router.get("/stats/:instituteId", getQueueStats);
router.delete("/remove/:instituteId/:userId", removeUserFromQueue);
router.delete("/leave/:instituteId", authenticateUser, leaveQueue);


export default router;
