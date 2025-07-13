const express = require('express');
const { getActiveTournaments } = require('../../controllers/Player/TournamentAccessController');
const router = express.Router();


router.get('/getmatch',getActiveTournaments); 

module.exports = router;