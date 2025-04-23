var ex = require("express");
var cors = require("cors");
var app = ex();
var { MongoClient } = require("mongodb");
app.use(cors());
var url = "mongodb+srv://cmani0395:manimani@cluster0.tuy7ost.mongodb.net/";
var client = new MongoClient(url);

app.get("/updateeb", async (req, res) => {
    try {
        const eid = req.query.id;
        var ename = req.query.name;
        var cu = req.query.current;
        var pu = req.query.privious;

        if (!eid) {
            return res.status(400).send({ error: "Registration number (eid) is required" });
        }
        if (!ename) {
            return res.status(400).send({ error: "Name is required" });
        }
        if (!cu) {
            return res.status(400).send({ error: "Current unit is required" });
        }
        if (!pu) {
            return res.status(400).send({ error: "Previous unit is required" });
        }

        await client.connect();
        var db = client.db("electro");
        var collection = db.collection("ebbill");

        var result = await collection.findOne({ id: Number(eid) });

        if (!result) {
            return res.status(404).send({ error: "Record with this registration number not found" });
        }

        var updatedData = {
            $set: {
                name: ename,
                currentunit: Number(cu),
                previousunit: Number(pu),
            }
        };

        // Perform update operation
        var updateResult = await collection.updateOne({ id: Number(eid) }, updatedData);

        if (updateResult.modifiedCount > 0) {
            return res.status(200).send({ message: "Record updated successfully" });
        } else {
            return res.status(500).send({ error: "Failed to update the record" });
        }

    } catch (e) {
        res.status(500).send({ error: "An error occurred while processing your request" });
        console.error(e);
    } finally {
        await client.close();
    }
});

module.exports=app;
