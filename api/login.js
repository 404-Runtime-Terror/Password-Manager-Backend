const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
require('dotenv').config();

const client = new MongoClient(
  process.env.DB_URL
);

router.get("/", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();

    collection.map((userData) => {
      if (userData.passwords === req.query.pass) {
        return res.status(200).json({ key: userData.passwords });
      }
    });

    return res.status(200).json({ key: "User Not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
