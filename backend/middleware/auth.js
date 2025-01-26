import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach the user ID to the request object
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export default authenticateUser;