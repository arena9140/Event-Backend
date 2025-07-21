const express = require('express');
const {
    getActiveTournaments,
    joinTournament
} = require('../../controllers/Player/TournamentAccessController');

const playerVerification = require("../../middleware/PlayerToken");
const router = express.Router();

router.get('/getmatch', playerVerification, getActiveTournaments);
router.post('/joinmatch', playerVerification, joinTournament); // New route to join

module.exports = router;
