const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dfgtkadsb',
  api_key: '612284632566215',
  api_secret: 'D5vmeUz_13cJrBT7O7KYsA5weQo'
});

module.exports = cloudinary;
