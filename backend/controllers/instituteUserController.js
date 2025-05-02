import instituteUserModel from "../models/institueUserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Function to login
const loginInstituteUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await instituteUserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = createToken(user._id);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isProfileComplete: user.isProfileComplete,
            },
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
};

// Function to register institute
const registerInstitute = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols",
            });
        }

        const existingUser = await instituteUserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await instituteUserModel.create({
            name,
            email,
            password: hashedPassword,
            isProfileComplete: false,
        });

        const token = createToken(newUser._id);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isProfileComplete: newUser.isProfileComplete,
            },
            token,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while registering the user" });
    }
};

// Function to complete profile
const completeProfile = async (req, res) => {
    try {
        const userId = req.userId; // From authenticate middleware

        // Log the incoming request body to check for any issues
        console.log("Request Body:", req.body);

        const {
            zipcode,
            phonenumber,
            type,
            streetAddress,
            city,
            state,
            approxTimePerPerson,
            startTime,
            endTime
        } = req.body;

        // Validate required fields
        if (!zipcode || !phonenumber || !type || !streetAddress || !city || !state || approxTimePerPerson === undefined || !startTime || !endTime) {
            return res.status(400).json({
                error: "All fields are required: zipcode, phonenumber, type, streetAddress, city, state, approxTimePerPerson, startTime, endTime",
            });
        }

        // Additional validation
        if (typeof approxTimePerPerson !== "number" || approxTimePerPerson <= 0) {
            return res.status(400).json({ error: "approxTimePerPerson must be a positive number" });
        }

        // Validate start and end times
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: "Invalid date format for startTime or endTime" });
        }

        if (start >= end) {
            return res.status(400).json({ error: "startTime must be before endTime" });
        }

        // Log the validated data
        console.log("Validated Data:", {
            zipcode,
            phonenumber,
            type,
            streetAddress,
            city,
            state,
            approxTimePerPerson,
            startTime,
            endTime
        });

        // Update user
        const updatedUser = await instituteUserModel.findByIdAndUpdate(
            userId,
            {
                zipcode,
                phonenumber,
                type,
                streetAddress,
                city,
                state,
                approxTimePerPerson,
                startTime,
                endTime,
                isProfileComplete: true,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "Profile completed successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error completing profile:", error);
        return res.status(500).json({ error: "An error occurred while completing the profile" });
    }
};

// Show email and name (for dashboard etc.)
const showdataEmailName = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await instituteUserModel.findById(userId).select("name email");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
};

// Show everything except name and email
const showDataExceptEmailName = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Authorization token is required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await instituteUserModel.findById(userId).select("-name -email");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User data fetched successfully",
            user,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
};
const updateProfileExceptEmailName = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            zipcode,
            phonenumber,
            type,
            streetAddress,
            city,
            state,
            approxTimePerPerson,
            startTime,
            endTime
        } = req.body;

        // Initialize an object to hold the update data
        const updateData = {};

        // Check each field and only add it to the update data if it's provided
        if (zipcode) updateData.zipcode = zipcode;
        if (phonenumber) updateData.phonenumber = phonenumber;
        if (type) updateData.type = type;
        if (streetAddress) updateData.streetAddress = streetAddress;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (approxTimePerPerson !== undefined) {
            if (typeof approxTimePerPerson !== "number" || approxTimePerPerson <= 0) {
                return res.status(400).json({ error: "approxTimePerPerson must be a positive number" });
            }
            updateData.approxTimePerPerson = approxTimePerPerson;
        }
        if (startTime) {
            const startDate = new Date(startTime);
            if (isNaN(startDate)) {
                return res.status(400).json({ error: "Invalid date format for startTime" });
            }
            updateData.startTime = startDate;
        }
        if (endTime) {
            const endDate = new Date(endTime);
            if (isNaN(endDate)) {
                return res.status(400).json({ error: "Invalid date format for endTime" });
            }
            updateData.endTime = endDate;
        }

        // If no fields to update, return an error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "At least one field must be provided for update" });
        }

        // Perform the update operation
        const updatedUser = await instituteUserModel.findByIdAndUpdate(userId, updateData, { new: true, select: "-name -email" });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "An error occurred while updating the profile" });
    }
};

const updateApproxTimePerPerson = async (req, res) => {
    try {
        const userId = req.userId;
        const { approxTimePerPerson } = req.body;

        // Validate: must be present and positive
        if (approxTimePerPerson === undefined) {
            return res.status(400).json({ error: "approxTimePerPerson is required" });
        }

        if (typeof approxTimePerPerson !== "number" || approxTimePerPerson <= 0) {
            return res.status(400).json({ error: "approxTimePerPerson must be a positive number" });
        }

        const updatedUser = await instituteUserModel.findByIdAndUpdate(
            userId,
            { approxTimePerPerson },
            { new: true, select: "approxTimePerPerson" }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "approxTimePerPerson updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating approxTimePerPerson:", error);
        res.status(500).json({ error: "An error occurred while updating approxTimePerPerson" });
    }
};

const getInstituteDetails = async (req, res) => {
    const { instituteId } = req.params;

    try {
        const institute = await instituteUserModel.findById(instituteId);
        if (!institute) {
            return res.status(404).json({ error: "Institute not found" });
        }

        res.status(200).json({
            message: "Institute details fetched successfully",
            institute: {
                name: institute.name,
                startTime: institute.startTime,
                endTime: institute.endTime
            }
        });
    } catch (error) {
        console.error("Error fetching institute details:", error);
        res.status(500).json({ error: "An error occurred while fetching the institute details" });
    }
};


export {
    registerInstitute,
    completeProfile,
    loginInstituteUser,
    showdataEmailName,
    showDataExceptEmailName,
    updateProfileExceptEmailName,
    updateApproxTimePerPerson,
    getInstituteDetails,
};
