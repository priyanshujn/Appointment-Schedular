const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${mongoose.connection.host}`);
    } catch (err) {
        console.error(`Mongodb Server Issue ${err}`);
    }
}

module.exports = connectDB;