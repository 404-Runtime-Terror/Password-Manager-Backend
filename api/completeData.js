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
    // userID = "63c8335cc61868d253fca584";
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password").aggregate().toArray();
    collection.find(e => {
      if ((e._id).equals(userID)) {
        JSONfile = { e };
        flag = true;
      }
    }
    )
    if (flag) {
      const data = await fetchData(userID);
        mainJson = {userdata : data,data :JSONfile};
        console.log(mainJson);
        return res.status(200).json(mainJson);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
