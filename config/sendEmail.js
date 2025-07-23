// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBulkEmail(recipients, subject, htmlContent) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients, // can be an array
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendBulkEmail;
