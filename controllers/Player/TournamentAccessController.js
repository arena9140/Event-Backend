const Tournament = require("../../models/Tournament");
const Wallet = require("../../models/Wallet/PlayerWallet");
const Player = require("../../models/PlayerModels/PlayerRegister");
const JoinedPlayer = require("../../models/PlayerModels/JoinedPlayer")
const sendBulkEmail = require("../../config/sendEmail");



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

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found." });
    }

    const entryFee = tournament.entryFee || 0;
    if (wallet.balance < entryFee) {
      return res.status(400).json({ message: "Insufficient wallet balance." });
    }

    const player = await Player.findById(userId);
    if (!player || !player.email) {
      return res.status(400).json({ message: "Player email not found." });
    }

    // ✅ Deduct entry fee and update tournament players
    wallet.balance -= entryFee;
    players.push(userId);
    tournament.players = players;

    // ✅ Handle JoinedPlayer logic
    let joinedDoc = await JoinedPlayer.findOne({ tournamentId });

    if (!joinedDoc) {
      // Document doesn't exist, create new
      joinedDoc = new JoinedPlayer({
        tournamentId,
        matchStartTime: tournament.matchStartTime,
        players: [{
          userId,
          email: player.email,
          joinedAt: new Date()
        }]
      });
    } else {
      // Check if already joined
      const alreadyJoined = joinedDoc.players.some(p => p.userId.toString() === userId);
      if (alreadyJoined) {
        return res.status(400).json({ message: "Already joined the tournament." });
      }

      joinedDoc.players.push({
        userId,
        email: player.email,
        joinedAt: new Date()
      });
    }

    // ✅ Save all
    await Promise.all([
      wallet.save(),
      tournament.save(),
      joinedDoc.save()
    ]);

    res.status(200).json({ message: "Successfully joined the tournament. Entry fee deducted." });

  } catch (error) {
    console.error("Join Tournament Error:", error);
    res.status(500).json({ message: "Failed to join tournament.", error: error.message });
  }
};

exports.sendMailToJoinedPlayers = async (req, res) => {
  try {
    const { tournamentId, roomId, roomPassword } = req.body;

    if (!roomId || !roomPassword) {
      return res.status(400).json({ message: "Room ID and Password are required." });
    }

    // Fetch joined players
    const joinedDoc = await JoinedPlayer.findOne({ tournamentId });
    if (!joinedDoc || !joinedDoc.players || joinedDoc.players.length === 0) {
      return res.status(404).json({ message: "No players have joined this tournament." });
    }

    const emails = joinedDoc.players.map(player => player.email);

    const subject = "🎮 ArenaClash Match Details – Room Info Enclosed!";

    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333;">🎮 ArenaClash Match Details</h2>
    <p style="font-size: 16px; color: #444;">
      Dear Player,
    </p>
    <p style="font-size: 16px; color: #444;">
      This is a reminder that your tournament match will begin at:
    </p>
    <p style="font-size: 18px; font-weight: bold; color: #222;">
      ${new Date(joinedDoc.matchStartTime).toLocaleString()}
    </p>

    <hr style="margin: 20px 0;" />

    <p style="font-size: 16px; color: #444;"><strong>Room ID:</strong> <span style="color: #111;">${roomId}</span></p>
    <p style="font-size: 16px; color: #444;"><strong>Password:</strong> <span style="color: #111;">${roomPassword}</span></p>

    <hr style="margin: 20px 0;" />

    <p style="font-size: 16px; color: #555;">
      Please make sure to join the room on time. Late entries may not be allowed.
    </p>

    <p style="font-size: 16px; color: #555;">
      Best of luck! 💪
    </p>

    <p style="font-size: 14px; color: #888;">
      – ArenaClash Team
    </p>
  </div>
`;


    await sendBulkEmail("nileshkus9@gmail.com", subject, html);

    res.status(200).json({ message: "Emails sent with Room ID and Password." });

  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Error while sending emails", error: error.message });
  }
};
