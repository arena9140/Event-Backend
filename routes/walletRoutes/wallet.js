const express = require("express");
const router = express.Router();
const { addMoney, verifyPayment } = require("../../controllers/Wallet/WalletController");
const auth = require("../../middleware/PlayerToken"); // Required for req.user.id
console.log(auth);

router.post("/add-money", auth, addMoney);
router.post("/verify-payment", auth, verifyPayment);

module.exports = router;
