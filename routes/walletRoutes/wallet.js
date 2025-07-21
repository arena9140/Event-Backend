const express = require("express");
const router = express.Router();
const { addMoney, verifyPayment, getWalletBalance } = require("../../controllers/Wallet/WalletController");
const auth = require("../../middleware/PlayerToken"); 
console.log(auth);

router.post("/add-money", auth, addMoney);
router.post("/verify-payment", auth, verifyPayment);
router.get('/balance', auth, getWalletBalance);

module.exports = router;
