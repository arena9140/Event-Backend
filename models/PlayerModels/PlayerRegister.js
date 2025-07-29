const mongoose = require('mongoose');

const PlayerRegisterSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profileImage: String
});

module.exports = mongoose.model('PlayerRegister', PlayerRegisterSchema);
