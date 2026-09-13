require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectIoInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MONGODB Connected!!!
            ${connectIoInstance.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Connection Failed`, error);
        process.exit();
        
    }
};

module.exports = connectDB;