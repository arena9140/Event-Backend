const PlayerRegister = require('../../models/PlayerModels/PlayerRegister')
const jwt = require("jsonwebtoken")

const Register = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = new PlayerRegister({ name, email, password });
    const result = await newUser.save();
    if (result) {
        res.send({
            code: 201,
            message: "Player created successfully",
            success: true,
            error: false
        })
    } else {
        res.send({
            code: 404,
            message: "Failed to save Player",
            success: false,
            error: true
        })
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    const result = await PlayerRegister.findOne({ email, password })
    if (result) {
        const token = jwt.sign({ userId: result._id }, process.env.playerkey, { expiresIn: '1d' })
        res.send({
            code: 200,
            message: "Valid User",
            success: true,
            error: false,
            token
        })
    } else {
        res.send({
            code: 404,
            message: "User not found",
            success: false,
            error: true
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: "Unauthorized: No token provided",
                success: false,
                error: true
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.playerkey);
        const userId = decoded.userId;

        // Fetch user info
        const user = await PlayerRegister.findById(userId).select("name email");
        if (user) {
            res.status(200).json({
                code: 200,
                message: "Player profile fetched successfully",
                success: true,
                error: false,
                data: user
            });
        } else {
            res.status(404).json({
                code: 404,
                message: "Player not found",
                success: false,
                error: true
            });
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
            success: false,
            error: true
        });
    }
};

module.exports = {
    Register,
    Login,
    getProfile
};
