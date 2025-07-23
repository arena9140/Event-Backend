const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyTokenPlayer = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "").trim();
        
        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }
        const decoded = jwt.verify(token, process.env.playerkey);
        req.user = decoded;
        console.log(req.user);       
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyTokenPlayer;