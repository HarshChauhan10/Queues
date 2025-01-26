import mongoose from "mongoose";

const instituteUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    zipcode: { type: String },
    phonenumber: { type: String },
    isProfileComplete: { type: Boolean, default: false }, // Flag to track profile completion
});

const instituteUserModel = mongoose.models.instituteUser || mongoose.model("instituteUser", instituteUserSchema);

export default instituteUserModel;
