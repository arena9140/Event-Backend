const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyTokenPlayer = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Unauthorized: Token is missing or badly formatted",
            });
        }
        const token = authHeader.replace("Bearer ", "").trim();
        const decoded = jwt.verify(token, process.env.playerkey);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: true,
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = verifyTokenPlayer;
