import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach the user ID to the request object
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authenticateUser;
