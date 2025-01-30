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
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

    // Check if the token exists
    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Extract user ID from the token payload

        const { address, zipcode, phonenumber } = req.body;

        // Validation: Check if all required fields are provided
        if (!address || !zipcode || !phonenumber) {
            return res.status(400).json({ error: "Address, zipcode, and phone number are required" });
        }

        // Update the user's profile
        const updatedUser = await instituteUserModel.findByIdAndUpdate(
            userId, // Use the user ID from the token
            { address, zipcode, phonenumber, isProfileComplete: true },
            { new: true } // Return the updated user document
        );

        // If user is not found
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Respond with success
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                address: updatedUser.address,
                zipcode: updatedUser.zipcode,
                phonenumber: updatedUser.phonenumber,
                isProfileComplete: updatedUser.isProfileComplete,
            },
        });
    } catch (error) {
        console.error("Error completing profile:", error);

        // Handle invalid or expired tokens
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Handle other errors
        res.status(500).json({ error: "An error occurred while updating the profile" });
    }
};

export { registerInstitute, completeProfile, loginInstituteUser };

