const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "").trim();
        console.log(token);
        
        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }
        const decoded = jwt.verify(token, process.env.key);
        req.user = decoded;         
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;