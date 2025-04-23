var ex = require("express");
var cors = require("cors");
var app = ex();
var { MongoClient } = require("mongodb");
app.use(cors());
var url = "mongodb+srv://cmani0395:manimani@cluster0.tuy7ost.mongodb.net/";
var client = new MongoClient(url);
    
app.get("/deleteeb", async (req, res) => {
    try {
        const eid = req.query.id;

        // Validate the required field
        if (!eid) {
            return res.status(400).send({ error: "Registration number (eid) is required" });
        }

        await client.connect();
        var db = client.db("electro");
        var collection = db.collection("ebbill");
        var result = await collection.findOne({ id: Number(eid) });

        if (!result) {
            // Record doesn't exist
            return res.status(404).send({ error: "Record with this registration number not found" });
        }

        // Perform the delete operation
        var deleteResult = await collection.deleteOne({ id: Number(eid) });

        if (deleteResult.deletedCount > 0) {
            return res.status(200).send({ message: "Record deleted successfully" });
        } else {
            return res.status(500).send({ error: "Failed to delete the record" });
        }

    } catch (e) {
        res.status(500).send({ error: "An error occurred while processing your request" });
        console.error(e);
    } finally {
        await client.close();
    }
});
module.exports=app;
