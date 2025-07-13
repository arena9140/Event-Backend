const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
    map: { type: String, required: true },
    entryFee: { type: Number, required: true },
    winningCriteria: { type: String, required: true },
    prize: { type: String, required: true },
    gameMode: { type: String, required: true },
    matchStartTime: { type: Date, required: true },
    winner: { type: String, default: null },  // Winner ka naam (jab match complete hoga)
    status: { type: String, enum: ["active", "completed"], default: "active" }, // Match status
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Tournament", TournamentSchema);
