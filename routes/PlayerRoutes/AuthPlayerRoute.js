const express = require('express');
const { Register,Login, getProfile} = require('../../controllers/Player/PlayerAuthController');
const router = express.Router();


router.post('/register',Register); 
router.post('/login',Login); 
router.post('/getProfile',getProfile); 

module.exports = router;