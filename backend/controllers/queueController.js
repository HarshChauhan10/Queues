import Queue from "../models/queueModel.js";
import InstituteUser from "../models/institueUserModel.js";
import User from "../models/user.js";

// Join queue
export const joinQueue = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user || !user.gender) {
            return res.status(400).json({ message: "User not found or incomplete profile." });
        }

        // Check if user already in queue for this institute
        const alreadyQueued = await Queue.findOne({ instituteId, userId });
        if (alreadyQueued) {
            return res.status(400).json({ message: "You are already in the queue." });
        }

        const queueEntry = new Queue({
            instituteId,
            userId,
            gender: user.gender
        });

        await queueEntry.save();

        res.status(201).json({ message: "Joined queue successfully!" });
    } catch (error) {
        console.error("Error joining queue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all institutes with queue count
export const getInstitutesWithQueueCount = async (req, res) => {
    try {
        const institutes = await InstituteUser.find();

        const data = await Promise.all(
            institutes.map(async (institute) => {
                const count = await Queue.countDocuments({ instituteId: institute._id });
                return {
                    ...institute.toObject(),
                    queueCount: count
                };
            })
        );

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching institutes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get queue stats for an institute (for the Queue page)
export const getQueueStats = async (req, res) => {
    try {
        const { instituteId } = req.params;

        const total = await Queue.countDocuments({ instituteId });
        const maleCount = await Queue.countDocuments({ instituteId, gender: "Male" });
        const femaleCount = await Queue.countDocuments({ instituteId, gender: "Female" });
        const othersCount = await Queue.countDocuments({ instituteId, gender: "Others" });

        res.status(200).json({
            total,
            maleCount,
            femaleCount,
            othersCount
        });
    } catch (error) {
        console.error("Error fetching queue stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove user from queue
export const removeUserFromQueue = async (req, res) => {
    try {
        const { instituteId, userId } = req.params;

        const entry = await Queue.findOneAndDelete({ instituteId, userId });

        if (!entry) {
            return res.status(404).json({ message: "User not found in queue." });
        }

        res.status(200).json({ message: "User removed from queue successfully." });
    } catch (error) {
        console.error("Error removing user from queue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User removes themselves from queue
export const leaveQueue = async (req, res) => {
    try {
        const userId = req.user._id; // from verifyUser middleware
        const { instituteId } = req.params;

        const entry = await Queue.findOneAndDelete({ userId, instituteId });

        if (!entry) {
            return res.status(404).json({ message: "You are not in the queue for this institute." });
        }

        res.status(200).json({ message: "You have left the queue successfully." });
    } catch (error) {
        console.error("Error leaving queue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
