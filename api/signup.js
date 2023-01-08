const { MongoClient } = require("mongodb");
const express = require("express");
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
    var username = req.query.username;
    var email = req.query.email;
    var isexist = 0;

    //connect to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();
    const AddCollection = db.collection("AccountData");

    //encryption
    const salt = await bcrypt.genSalt(10);
    req.query.password = await bcrypt.hash(req.query.password, salt);

    //Encrypted password
    const EnPassword = req.query.password;

    //check the username and email
    collection.find((e) => {
      if (e.email === email) {
        isexist = 1;
      } else if (e.userName === username) {
        isexist = 2;
      }
    });
    //insert data into database if username and email is not exist
    if (isexist == 0) {
      AddCollection.insertOne(
        {
          userName: req.query.username,
          email: req.query.email,
          password: EnPassword,
          otp: null,
        },
        (err) => {
          if (err) {
            res.status(500).send("Server error");
          }
        }
      );
      res.status(200).json({ isSignup: true });
    } else if (isexist == 1) {
      res.status(200).json({ isSignup: false, isEmailExist: true });
    } else if (isexist == 2) {
      res.status(200).json({ isSignup: false, isUsernameExist: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
