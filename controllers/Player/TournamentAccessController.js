const Tournament = require("../../models/Tournament");
const Wallet = require("../../models/Wallet/PlayerWallet");

exports.getActiveTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ status: "active" });
    res.status(200).json(tournaments);
  } catch (error) {
    console.error("Error fetching active tournaments:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.joinTournament = async (req, res) => {
  try {
    const tournamentId = req.body.tournamentId;
    const userId = req.user.userId; 
    const tournament = await Tournament.findOne({ _id: tournamentId, status: "active" });
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found or not active." });
    }

    const players = tournament.players || [];
    if (players.includes(userId)) {
      return res.status(400).json({ message: "You have already joined this tournament." });
    }
    console.log(userId,"##########");
    
    const wallet = await Wallet.findOne({ user:  userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    // 4. Check if wallet has enough balance
    const entryFee = tournament.entryFee || 0;
    if (wallet.balance < entryFee) {
      return res.status(400).json({ message: "Insufficient wallet balance." });
    }

    // 5. Deduct the entry fee
    wallet.balance -= entryFee;

    // 6. Add user to tournament
    players.push(userId);
    tournament.players = players;

    // 7. Save both wallet and tournament
    await Promise.all([wallet.save(), tournament.save()]);

    res.status(200).json({ message: "Successfully joined the tournament. Entry fee deducted." });
  } catch (error) {
    console.error("Error joining tournament:", error);
    res.status(500).json({ message: "Failed to join tournament.", error: error.message });
  }
};


