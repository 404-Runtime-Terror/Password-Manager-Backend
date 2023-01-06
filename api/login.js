const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
require('dotenv').config();

const client = new MongoClient(
  process.env.DB_URL, { useUnifiedTopology: true });

router.get("/", async (req, res) => {
  try {
    var usernames = [];
    var password = [];
    var flag = 0;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();

    collection.map((e, index) => {
      usernames[index] = e.userName
      password[index] = e.password
    })

    usernames.map((e, index) => {
      const UserInputpassword = password[index];
      if (req.query.username == usernames[index]
        && req.query.password == UserInputpassword) {
        flag = 1;
      }
    })

    if (flag == 1) {
      res.json({ key: true });
    }

    // after deleting switch delete below else 
    else {
      res.json({ key: false });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
