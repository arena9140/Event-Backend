const express = require('express');
const { Register,Login, getProfile} = require('../../controllers/Player/PlayerAuthController');
const router = express.Router();

const playerVerification = require("../../middleware/PlayerToken");


router.post('/register',Register); 
router.post('/login',Login); 
router.post('/getProfile',playerVerification,getProfile); 

module.exports = router;