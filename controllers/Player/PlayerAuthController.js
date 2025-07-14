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
        console.log(result);

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

module.exports = {
  Register,
  Login
}