const multer = require('multer');
const path = require('path');

// Memory storage (we use file.buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
