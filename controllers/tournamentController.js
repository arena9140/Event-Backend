const Tournament = require("../models/Tournament");


exports.createTournament = async (req, res) => {
    try {
        const { map, entryFee, winningCriteria, prize, gameMode, matchStartTime } = req.body;

        if (!prize) return res.status(400).json({ message: "Prize is required." });

        const tournament = new Tournament({
            map,
            entryFee,
            winningCriteria,
            prize,
            gameMode,
            matchStartTime,
            createdBy: req.user.userId,
            status: "active"  // Default status: Active
        });

        await tournament.save();
        res.status(201).json({ message: "Tournament created successfully.", tournament });
    } catch (error) {
        console.error("Error creating tournament:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ **Finish Tournament (Enter Winner & Move to History)**
exports.finishTournament = async (req, res) => {
    try {
        const { winner } = req.body;

        if (!winner) return res.status(400).json({ message: "Winner name is required." });

        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: "Tournament not found." });

        tournament.winner = winner;
        tournament.status = "completed";  // Move to history
        await tournament.save();

        res.status(200).json({ message: "Tournament finished successfully.", tournament });
    } catch (error) {
        console.error("Error finishing tournament:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ **Get All Active Tournaments**
exports.getActiveTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find({ status: "active" });
        res.status(200).json(tournaments);
    } catch (error) {
        console.error("Error fetching active tournaments:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ **Get Tournament History (Completed Matches)**
exports.getTournamentHistory = async (req, res) => {
    try {
        const tournaments = await Tournament.find({ status: "completed" });
        res.status(200).json(tournaments);
    } catch (error) {
        console.error("Error fetching tournament history:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

