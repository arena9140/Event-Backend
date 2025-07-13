const express = require("express");
const { createTournament, finishTournament, getActiveTournaments, getTournamentHistory } = require("../controllers/tournamentController");
const isAdmin = require("../middleware/AdminToken");

const router = express.Router();

router.post("/create", isAdmin, createTournament);  // 🟢 Create Tournament
router.put("/finish/:id", isAdmin, finishTournament);  // 🔴 Finish Tournament (Enter Winner)
router.get("/active", getActiveTournaments);  // 🟢 Get Active Matches
router.get("/history", getTournamentHistory);  // 🟢 Get Completed Matches (History)

module.exports = router;
