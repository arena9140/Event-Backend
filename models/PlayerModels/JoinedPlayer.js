// models/JoinedPlayer.js
const mongoose = require("mongoose");

const PlayerEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  email: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});

const JoinedPlayerSchema = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true, unique: true },
  matchStartTime: { type: Date, required: true },
  players: [PlayerEntrySchema]
});

module.exports = mongoose.model("JoinedPlayer", JoinedPlayerSchema);
