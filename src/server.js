require("dotenv").config();

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/connectDB");

const app = require("./app");

const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`Listening from http://localhost:${PORT}`);
        })
        
    } catch (error) {
        console.log(`MONGODB CONNECTION FAILED`, error);
        
    }
}

startServer();