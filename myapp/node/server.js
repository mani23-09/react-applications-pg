var ex = require("express");
var cors = require("cors");
var app = ex();
var { MongoClient } = require("mongodb");
app.use(cors());
var url = "mongodb://localhost:27017";
var client = new MongoClient(url);
app.get("/res", async (req, res) => {
    try {
        const eid = req.query.id; 

        if (!eid) {
            return res.status(400).send({ error: "Registration number (eid) is required" });
        }
        await client.connect();
        var db = client.db("electro");
        var collection = db.collection("empsal");

        var result = await collection.findOne({ empid: Number(eid) });
        if (!result) {
            return res.status(404).send({ error: "Student not found" });
        }
        res.send([result]);
    } catch (e) {
        res.status(500).send({ error: "An error occurred while fetching the marks" });
        console.error(e);
    } finally {
        await client.close();
    }
});
module.exports=app;
