var express = require('express');
var router = express.Router();
var { MongoClient } = require('mongodb');
var url = 'mongodb://localhost:27017';
var client = new MongoClient(url);

// POST route for inserting data
router.post('/inserte', async (req, res) => {
  try {
    const { id, name, currentunit, priviousunit } = req.body;

    // Check for required parameters
    if (!id || !name || !currentunit || !priviousunit) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    await client.connect();
    var db = client.db('electro');
    var collection = db.collection('ebbill');

    // Insert the data
    const result = await collection.insertOne({
      id: Number(id),
      name,
      currentunit: Number(currentunit),
      priviousunit: Number(priviousunit),
    });

    if (result.acknowledged) {
      return res.status(200).send({ message: 'Record added successfully' });
    } else {
      return res.status(500).send({ error: 'Failed to add record' });
    }
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).send({ error: 'An error occurred while processing your request' });
  } finally {
    await client.close();
  }
});

module.exports = router;
