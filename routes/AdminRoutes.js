const express = require('express');
const { Register,Login,GetAdmin} = require('../controllers/AdminController.js');
const router = express.Router();
const  isAdmin  = require("../middleware/AdminToken"); 


router.post('/register',Register); 
router.post('/login',Login);
router.get('/profile',isAdmin,GetAdmin); 

module.exports = router;