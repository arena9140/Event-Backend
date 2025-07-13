const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const PlayerRegister = mongoose.model("Player",PlayerSchema);
module.exports = PlayerRegister;