import instituteUserModel from "../models/institueUserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Function to login
const loginInstituteUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation: Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find the user by email
        const user = await instituteUserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Create a JWT token
        const token = createToken(user._id);

        // Respond with the user information and token
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


// Register institute function
const registerInstitute = async (req, res) => {
    const { name, email, password } = req.body; // Collect only basic fields
    //console.log(req.body)
    try {
        // Validation: Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }

        // Validation: Check if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email address" });
        }

        // Validation: Check if password is strong enough
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long, include a mix of uppercase, lowercase, numbers, and symbols",
            });
        }

        // Check if the email is already registered
        const existingUser = await instituteUserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new institute user with `isProfileComplete` set to false
        const newUser = await instituteUserModel.create({
            name,
            email,
            password: hashedPassword,
            isProfileComplete: false, // Profile is incomplete at this stage
        });

        // Create a JWT token
        const token = createToken(newUser._id);

        // Respond with the newly created user and token
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
        // Handle errors and respond with a status code
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while registering the user" });
    }
};

const completeProfile = async (req, res) => {
    try {
        const userId = req.userId; // This is set by authenticateUser middleware

        const { zipcode, phonenumber, type, streetAddress, city, state } = req.body;

        // Validation: Check if all required fields are provided
        if (!zipcode || !phonenumber || !type || !streetAddress || !city || !state) {
            return res.status(400).json({
                error: "All fields are required: zipcode, phone number, type, street address, city, state",
            });
        }

        // Update user profile
        const updatedUser = await instituteUserModel.findByIdAndUpdate(
            userId,
            { zipcode, phonenumber, type, streetAddress, city, state, isProfileComplete: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Respond with success
        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser, // Return updated user object
        });
    } catch (error) {
        console.error("Error completing profile:", error);
        return res.status(500).json({ error: "An error occurred while updating the profile" });
    }
};


const showdataEmailName = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract userId from token

        //  Fetch the specific user by ID
        const user = await instituteUserModel.findById(userId).select("name email");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user, // Now correctly returning a single object
        });
    } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
};


const showDataExceptEmailName = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: "Authorization token is required" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Fetch user data excluding name and email
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

// Function to update user profile except name and email
const updateProfileExceptEmailName = async (req, res) => {
    try {
        const userId = req.userId; // Retrieved from authentication middleware
        const { zipcode, phonenumber, type, streetAddress, city, state } = req.body;

        // Update user profile excluding name and email
        const updatedUser = await instituteUserModel.findByIdAndUpdate(
            userId,
            { zipcode, phonenumber, type, streetAddress, city, state },
            { new: true, select: "-name -email" } // Exclude name and email from response
        );

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



export { registerInstitute, completeProfile, loginInstituteUser, showdataEmailName, showDataExceptEmailName, updateProfileExceptEmailName };

