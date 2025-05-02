import mongoose from "mongoose";

const instituteUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    zipcode: { type: String },
    phonenumber: { type: String },
    type: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    isProfileComplete: { type: Boolean, default: false }, // Flag to track profile completion

    // NEW FIELDS
    approxTimePerPerson: { type: Number, default: 5 }, // Time in minutes per person
    queueStats: { // Optional caching
        total: { type: Number, default: 0 },
        male: { type: Number, default: 0 },
        female: { type: Number, default: 0 },
        others: { type: Number, default: 0 }
    },
    startTime: {
        type: Date, // The time when users can start joining the queue
        required: false
    },
    endTime: {
        type: Date, // The time when users can no longer join the queue
        required: false
    },

});

const instituteUserModel = mongoose.models.instituteUser || mongoose.model("instituteUser", instituteUserSchema);

export default instituteUserModel;
