const express = require('express');
const { getActiveTournaments } = require('../../controllers/Player/TournamentAccessController');
const  playerVerification  = require("../../middleware/PlayerToken");
const router = express.Router();


router.get('/getmatch',playerVerification,getActiveTournaments); 

module.exports = router;