const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { json } = require("express");
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

//get request
async function fetchData(userID) {

  const client = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();
    collection.find((e) => {
      if (e._id.equals(userID)) {
        data = e;
      }
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}

router.get("/", async (req, res) => {
  try {
    userID = req.query.userID;
    var flag = false;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password").aggregate().toArray();
    collection.find(e => {
      if ((e._id).equals(userID)) {
        passwordData =  e ;
        flag = true;
      }
    }
    )
    if (flag) {
      const UserInfo = await fetchData(userID);
      return res.status(200).json({UserInfo, passwordData});

    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
