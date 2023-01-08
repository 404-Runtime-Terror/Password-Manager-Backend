const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

//get request
router.get("/", async (req, res) => {
  try {
    var usernames = [];
    var passwords = [];
    var flag = 0;

    await client.connect();
    const db = client.db("Users");

    //get data from database and store in array
    const collection = await db.collection("AccountData").aggregate().toArray();

    //check the username and password
    for (let i = 0; i < collection.length; i++) {
      usernames[i] = collection[i].userName;
      passwords[i] = collection[i].password;
    }

    //compare the username and password
    for (let i = 0; i < usernames.length; i++) {
      if (req.query.username == usernames[i]) {
        //compare the password
        const match = await bcrypt.compare(req.query.password, passwords[i]);
        if (match) {
          //set the flag if username and password is correct
          flag = 1;
          break;
        }
      }
    }
    if (flag == 1) {
      res.status(200).json({ key: true });
    } else {
      res.status(200).json({ key: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
