const Tournament = require("../../models/Tournament");

exports.getActiveTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find({ status: "active" });
        res.status(200).json(tournaments);
    } catch (error) {
        console.error("Error fetching active tournaments:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};