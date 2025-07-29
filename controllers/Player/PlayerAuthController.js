const PlayerRegister = require('../../models/PlayerModels/PlayerRegister');
const jwt = require("jsonwebtoken");
const cloudinary = require('../../config/cloudinary');
const path = require('path');
const fs = require('fs');

const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 🔐 Check if user already exists
        const existingUser = await PlayerRegister.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                code: 409,
                message: "Player already registered with this email",
                success: false,
                error: true
            });
        }

        let profileImageUrl;

        // 📤 Upload provided image or fallback to default
        if (req.file) {
            console.log("Uploaded file info:", req.file);
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: 'arena_clash/players',
                transformation: [{ width: 500, height: 500, crop: 'limit' }]
            });
            profileImageUrl = uploadResult.secure_url;
        } else {
            const defaultImagePath = path.join(__dirname, '../../assets/image.png');
            const uploadResult = await cloudinary.uploader.upload(defaultImagePath, {
                folder: 'arena_clash/players',
                transformation: [{ width: 500, height: 500, crop: 'limit' }]
            });
            profileImageUrl = uploadResult.secure_url;
        }

        const newUser = new PlayerRegister({
            name,
            email,
            password,
            profileImage: profileImageUrl
        });

        const result = await newUser.save();

        if (result) {
            return res.status(201).send({
                code: 201,
                message: "Player created successfully",
                success: true,
                error: false
            });
        } else {
            return res.status(400).send({
                code: 400,
                message: "Failed to save Player",
                success: false,
                error: true
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            code: 500,
            message: "Internal server error",
            success: false,
            error: true
        });
    }
};


const Login = async (req, res) => {
    const { email, password } = req.body;
    const result = await PlayerRegister.findOne({ email, password });
    if (result) {
        const token = jwt.sign({ userId: result._id }, process.env.playerkey, { expiresIn: '1d' });
        res.send({
            code: 200,
            message: "Valid User",
            success: true,
            error: false,
            token
        });
    } else {
        res.send({
            code: 404,
            message: "User not found",
            success: false,
            error: true
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await PlayerRegister.findById(userId).select("name email profileImage");

        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "Player not found",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            code: 200,
            message: "Player profile fetched successfully",
            success: true,
            error: false,
            data: user
        });
    } catch (err) {
        console.error("Error in getProfile:", err);
        return res.status(500).json({
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
