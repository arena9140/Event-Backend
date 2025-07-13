const mongoose = require('mongoose');

const DBconnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB connected successfully');
    } catch (error) {
        console.error('Error on connection:', error.message);
    }
};

module.exports = DBconnection;