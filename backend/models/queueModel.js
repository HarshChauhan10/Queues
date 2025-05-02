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
    movedToEndCount: {
        type: Number,
        default: 0
    },
    userStatus: {
        type: String,
        enum: ["joined", "left", "removed"],
        default: "joined" // To track the user's current participation status
    },
    windowStartTime: {
        type: Date,
        required: false
    },
    windowEndTime: {
        type: Date,
        required: false
    },
});

const Queue = mongoose.models.Queue || mongoose.model("Queue", queueSchema);

export default Queue;
