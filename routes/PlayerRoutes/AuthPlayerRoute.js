const express = require('express');
const router = express.Router();

const { Register, Login, getProfile } = require('../../controllers/Player/PlayerAuthController');
const playerVerification = require("../../middleware/PlayerToken");
const upload = require('../../middleware/upload'); // Multer

router.post('/register', upload.single('profileImage'), Register);
router.post('/login', Login);
router.post('/getProfile', playerVerification, getProfile);

module.exports = router;
