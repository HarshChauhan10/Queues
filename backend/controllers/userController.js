import User from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔐 Helper to create a JWT
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 📝 Register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters and include a mix of characters",
            });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, isProfileComplete: false });

        const token = createToken(user._id);

        res.status(201).json({
            message: "Registration successful",
            user: { id: user._id, name, email, isProfileComplete: user.isProfileComplete },
            token,
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Server error during registration" });
    }
};

// 🔓 Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return res.status(400).json({ error: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = createToken(user._id);

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email, isProfileComplete: user.isProfileComplete },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};

// ✅ Complete profile
const completeUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { gender, zipcode } = req.body;

        if (!gender || !zipcode) {
            return res.status(400).json({ error: "Gender and zipcode are required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { gender, zipcode, isProfileComplete: true },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            message: "Profile completed",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Profile completion error:", error);
        res.status(500).json({ error: "Server error during profile completion" });
    }
};

// 👀 Get Name & Email
const getNameAndEmail = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token missing" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("name email");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "Data fetched", user });
    } catch (error) {
        console.error("Get name/email error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// 📦 Get all except Name & Email
const getProfileExceptNameEmail = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Token missing" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-name -email -password");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "Data fetched", user });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✏️ Update profile except Name & Email
const updateProfileExceptNameEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            select: "-name -email -password",
        });

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export {
    registerUser,
    loginUser,
    completeUserProfile,
    getNameAndEmail,
    getProfileExceptNameEmail,
    updateProfileExceptNameEmail,
};
