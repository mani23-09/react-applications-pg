var ex = require("express");
var cors = require("cors");
var app = ex();
var { MongoClient } = require("mongodb");
app.use(cors());
var url = "mongodb+srv://cmani0395:manimani@cluster0.tuy7ost.mongodb.net/";
var client = new MongoClient(url);

app.get("/read", async (req, res) => {
    try {
        await client.connect();
        var db = client.db("electro");
        var collection = db.collection("ebbill");

        // Fetch all records from the collection
        var allData = await collection.find({}).toArray();

        // If data is found, send it back, otherwise send an empty array
        if (allData.length > 0) {
            res.status(200).send({ data: allData });
        } else {
            res.status(404).send({ message: "No data found" });
        }

    } catch (e) {
        res.status(500).send({ error: "An error occurred while fetching the data" });
        console.error(e);
    } finally {
        await client.close();
    }
});
module.exports=app;

