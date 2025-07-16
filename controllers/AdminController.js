const AdminRegister = require('../models/AdminRegister.js')
const jwt = require("jsonwebtoken")

const Register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await AdminRegister.findOne({ email });

        if (existingUser) {
            return res.send({
                code: 409,
                message: "User already exists",
                success: false,
                error: true
            });
        }

        const newUser = new AdminRegister({ name, email, password });
        const result = await newUser.save();

        if (result) {
            res.send({
                code: 201,
                message: "User created successfully",
                success: true,
                error: false
            });
        } else {
            res.send({
                code: 500,
                message: "Failed to save user",
                success: false,
                error: true
            });
        }
    } catch (err) {
        res.send({
            code: 500,
            message: "Internal Server Error",
            success: false,
            error: true
        });
    }
}


const Login = async (req, res) => {
    const { email, password } = req.body;
    const result = await AdminRegister.findOne({ email, password })
    if (result) {
        console.log(result);

        const token = jwt.sign({ userId: result._id }, process.env.key , { expiresIn: '1h' })
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

// Get admin details for profile
const GetAdmin = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming userId is extracted from middleware
        const admin = await AdminRegister.findById(userId, 'name');

        if (admin) {
            res.send({
                code: 200,
                message: "Admin found",
                success: true,
                error: false,
                admin
            });
        } else {
            res.send({
                code: 404,
                message: "Admin not found",
                success: false,
                error: true
            });
        }
    } catch (error) {
        res.send({
            code: 500,
            message: "Internal Server Error",
            success: false,
            error: true
        });
    }
}

module.exports = {
    Register,
    Login,
    GetAdmin
}
