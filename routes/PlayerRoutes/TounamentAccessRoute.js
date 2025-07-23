const express = require('express');
const {
    getActiveTournaments,
    joinTournament,
    sendMailToJoinedPlayers
} = require('../../controllers/Player/TournamentAccessController');

const playerVerification = require("../../middleware/PlayerToken");
const AdminToken = require("../../middleware/AdminToken");
const router = express.Router();

router.get('/getmatch', playerVerification, getActiveTournaments);
router.post('/joinmatch', playerVerification, joinTournament); // New route to join
router.post('/sendMailToJoinedPlayers', AdminToken, sendMailToJoinedPlayers); // New route to join

module.exports = router;
