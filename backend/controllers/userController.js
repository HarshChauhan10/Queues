import User from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper: Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
const registerUser = async (req, res) => {
    const { name, email, password, gender, zipcode } = req.body;

    try {
        if (!name || !email || !password || !gender || !zipcode) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Password not strong enough" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            zipcode
        });

        const token = createToken(user._id);

        res.status(201).json({ message: "User registered", user: { id: user._id, name, email }, token });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = createToken(user._id);

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Show full user data
const getUserData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token missing" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update user data
const updateUserData = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token missing" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(decoded.id, updates, { new: true }).select("-password");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User updated", user });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export { registerUser, loginUser, getUserData, updateUserData };
