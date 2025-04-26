import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instituteUser",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Others"]
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["active", "completed", "removed"],
        default: "active"
    },
    movedToEnd: {
        type: Boolean,
        default: false
    }
});

const Queue = mongoose.models.Queue || mongoose.model("Queue", queueSchema);

export default Queue;
