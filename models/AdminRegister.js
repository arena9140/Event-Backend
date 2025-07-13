const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const AdminRegister = mongoose.model("Admin",AdminSchema);
module.exports = AdminRegister;