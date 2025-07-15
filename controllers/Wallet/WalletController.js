const Razorpay = require("razorpay");
const crypto = require("crypto");
const Wallet = require("../../models/Wallet/PlayerWallet");
const Transaction = require("../../models/Wallet/Transaction");

// Razorpay Config
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Error in addMoney:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const userId = req.user.userId;
    console.log(userId,"###########");
    

    // Update wallet balance
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );

    // Save transaction
    await Transaction.create({
      userId,
      amount,
      type: "credit",
      status: "success",
      razorpay_order_id,
      razorpay_payment_id,
    });
    res.status(200).json({ message: "₹" + amount + " added to wallet", wallet });
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res.status(500).json({ error: "Server error" });
  }
};
