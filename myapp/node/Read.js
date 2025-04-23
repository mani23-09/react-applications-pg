const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

// ✅ MongoDB connection URI — removed trailing slash after appName
const url = "mongodb+srv://cmani0395:manimani@cluster0.tuy7ost.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Use MongoClient options for proper SSL/TLS support
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
});

app.get("/read", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("electro");
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
    } finally {
        await client.close();
    }
});

module.exports = app;
