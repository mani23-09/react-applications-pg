require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

const url = "mongodb+srv://cmani0395:manimani@cluster0.tuy7ost.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
});

let db;

async function start() {
    try {
        await client.connect();
        db = client.db("electro");

        app.get("/read", async (req, res) => {
            try {
                const collection = db.collection("ebbill");
                const allData = await collection.find({}).toArray();

                if (allData.length > 0) {
                    res.status(200).json({ data: allData });
                } else {
                    res.status(404).json({ message: "No data found" });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ error: "An error occurred while fetching the data" });
            }
        });

        const PORT = process.env.PORT || 7654;
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });

    } catch (e) {
        console.error("❌ Failed to connect to MongoDB", e);
        process.exit(1);
    }
}

start();
module.exports = app;