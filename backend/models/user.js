import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        required: false
    },
    zipcode: {
        type: String,
        required: false
    },
    isProfileComplete: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
