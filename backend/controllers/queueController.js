import Queue from "../models/queueModel.js";  // Import the Queue model
import User from "../models/user.js";  // Import the User model
import Institute from "../models/institueUserModel.js";  // Import the Institute model
import moment from "moment";
import cron from "node-cron";


const joinQueue = async (req, res) => {
    const { instituteId, gender } = req.body;
    const userId = req.userId; // From the JWT token

    try {
        // Fetch the institute to get the start and end times
        const institute = await Institute.findById(instituteId);
        if (!institute) {
            return res.status(404).json({ error: "Institute not found" });
        }

        // Get the current time
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;

        // Convert the startTime and endTime to total minutes for comparison
        const [startHour, startMinute] = institute.startTime.split(":").map(Number);
        const [endHour, endMinute] = institute.endTime.split(":").map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        // Check if the current time is within the allowed time window
        if (currentTotalMinutes < startTotalMinutes || currentTotalMinutes > endTotalMinutes) {
            return res.status(400).json({ error: `You can only join the queue between ${institute.startTime} and ${institute.endTime}` });
        }

        // Check if the user is already in the queue for the given institute and is still active
        const existingQueue = await Queue.findOne({ userId, instituteId, userStatus: "joined" });

        if (existingQueue) {
            return res.status(400).json({ error: "User has already joined this queue" });
        }

        // Add user to the queue
        const newQueue = new Queue({
            instituteId,
            userId,
            gender,
            userStatus: "joined",
        });

        await newQueue.save();

        // Populate the user details
        await newQueue.populate("userId", "name"); // Populate the name from the User model

        res.status(201).json({
            message: "User successfully joined the queue",
            queue: newQueue
        });

    } catch (error) {
        console.error("Error joining queue:", error);
        res.status(500).json({ error: "An error occurred while joining the queue" });
    }
};
const getUserQueuePosition = async (req, res) => {
    const { instituteId } = req.params;
    const userId = req.userId;

    try {
        const queues = await Queue.find({ instituteId, userStatus: "joined" })
            .sort({ joinedAt: 1 }); // Sort by queue order

        const position = queues.findIndex(q => q.userId.toString() === userId);

        if (position === -1) {
            return res.status(404).json({ error: "User is not in the queue" });
        }

        res.status(200).json({
            position: position + 1, // 1-based index
            totalInQueue: queues.length,
            peopleAhead: position
        });
    } catch (error) {
        console.error("Error getting user queue position:", error);
        res.status(500).json({ error: "An error occurred while getting queue position" });
    }
};

// Function to leave a queue
const leaveQueue = async (req, res) => {
    const { instituteId } = req.body;
    const userId = req.userId; // From the JWT token

    try {
        // Check if the user is currently in the queue
        const queue = await Queue.findOne({ userId, instituteId, userStatus: "joined" });

        if (!queue) {
            return res.status(400).json({ error: "User is not in the queue or has already left" });
        }

        // Update the queue status to "left"
        queue.userStatus = "left";
        await queue.save();

        res.status(200).json({
            message: "User successfully left the queue",
            queue
        });

    } catch (error) {
        console.error("Error leaving queue:", error);
        res.status(500).json({ error: "An error occurred while leaving the queue" });
    }
};

// Function to remove a user from a queue (e.g., if the user is kicked out)
const removeUserFromQueue = async (req, res) => {
    const { instituteId, userIdToRemove } = req.body; // specify which user to remove
    const requesterId = req.userId; // From the JWT token

    try {
        // Check if requester is an institute admin
        const institute = await Institute.findById(instituteId);
        if (!institute || institute._id.toString() !== requesterId) {
            return res.status(403).json({ error: "Only institutes can remove users from the queue" });
        }

        // Find the queue entry for the target user, regardless of whether they've left or are joined
        const queue = await Queue.findOne({ userId: userIdToRemove, instituteId });

        if (!queue || (queue.userStatus !== "joined" && queue.userStatus !== "left")) {
            return res.status(400).json({ error: "User is not currently in the queue or has already been removed" });
        }

        // Mark as removed
        queue.userStatus = "removed";
        await queue.save();

        res.status(200).json({
            message: "User successfully removed from the queue",
            queue
        });

    } catch (error) {
        console.error("Error removing user from queue:", error);
        res.status(500).json({ error: "An error occurred while removing the user from the queue" });
    }
};

// Function to fetch all queues for a specific institute
const getQueuesForInstitute = async (req, res) => {
    const { instituteId } = req.params;

    try {
        // Fetch all queues for the specific institute
        const queues = await Queue.find({ instituteId }).populate("userId", "name email gender");

        if (!queues || queues.length === 0) {
            return res.status(404).json({ error: "No queues found for this institute" });
        }

        res.status(200).json({
            message: "Queues fetched successfully",
            queues
        });

    } catch (error) {
        console.error("Error fetching queues for institute:", error);
        res.status(500).json({ error: "An error occurred while fetching the queues" });
    }
};
// Function to move a user to the back of the queue manually by the institute
const moveUserToEnd = async (req, res) => {
    const { instituteId, userId } = req.body;

    try {
        const queue = await Queue.findOne({ userId, instituteId, userStatus: "joined" });

        if (!queue) {
            return res.status(400).json({ error: "User is not in the queue or has already left" });
        }

        // Update joinedAt to current time and increment move count
        queue.joinedAt = new Date();
        queue.movedToEndCount += 1;
        await queue.save();

        res.status(200).json({
            message: "User moved to the end of the queue",
            queue
        });
    } catch (error) {
        console.error("Error moving user to end:", error);
        res.status(500).json({ error: "An error occurred while moving the user to the end of the queue" });
    }
};

// Function to move users to the end based on their windowEndTime
const autoMoveUserToEnd = async (queueId) => {
    try {
        const queue = await Queue.findById(queueId);

        if (
            !queue ||
            queue.userStatus !== "joined" ||
            !queue.windowEndTime ||
            moment(queue.windowEndTime).isAfter(moment())
        ) {
            return;
        }

        // Move to end of queue
        queue.joinedAt = new Date();
        queue.movedToEndCount = (queue.movedToEndCount || 0) + 1;
        queue.windowEndTime = null;
        queue.windowStartTime = null;

        await queue.save();
        console.log(`✅ User ${queue.userId} moved to end (${queue.movedToEndCount} times).`);
    } catch (error) {
        console.error(`❌ Error auto-moving user ${queueId}:`, error);
    }
};
const scheduleDynamicCronJobs = async () => {
    try {
        const queues = await Queue.find({
            userStatus: "joined",
            windowEndTime: { $exists: true, $ne: null }
        });

        queues.forEach((queue) => {
            const endTime = moment(queue.windowEndTime);
            const now = moment();

            if (endTime.isAfter(now)) {
                const cronTime = endTime.format("m H D M *"); // minute hour day month *

                cron.schedule(cronTime, async () => {
                    console.log(`⏰ Triggered cron for user ${queue.userId}`);
                    await autoMoveUserToEnd(queue._id);
                }, {
                    scheduled: true,
                    timezone: "UTC"
                });

                console.log(`📆 Scheduled job for user ${queue.userId} at ${endTime.toISOString()}`);
            }
        });
    } catch (error) {
        console.error("❌ Error scheduling dynamic cron jobs:", error);
    }
};

export {
    joinQueue,
    getUserQueuePosition,
    leaveQueue,
    removeUserFromQueue,
    getQueuesForInstitute,
    moveUserToEnd,
    autoMoveUserToEnd,
    scheduleDynamicCronJobs,
};
