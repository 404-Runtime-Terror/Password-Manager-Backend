
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

async function fetchdata(collection, userID) {
  var mainData;
  try {
    const data = await collection.find().toArray();
    data.find((e) => {
      if (e._id.toString() === userID) {
        mainData = e;
      }
    });
    console.log(mainData);
    return mainData;
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

async function createUser(collection, userID, mainData, website, Newusername, Newpassword) {
  var accounts;
  var flag = 0;
  try {
    mainData.passwords.find((e) => {
      console.log(e.websites);
      if (e.websites === website) {
        accounts = e.accounts;
        accounts.find((e) => {
          if (e.username !== Newusername) {
            flag = 1;
          }
        });
      }
    });
    console.log(flag);
    if (flag === 1) {

      accounts.push({ username: Newusername, password: Newpassword });
      collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
    }
    else {
      console.log("Username already exists");
    }
  }
  catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}
//get request
router.get("/", async (req, res) => {
  try {
    // var userID = req.query.userID;
    var userID = "63c6befa784b473173e4f3df";
    // var website = req.query.website;
    var website = "google1";
    // var newUsername = req.query.username;
    var newUsername = "user2";
    // var newPassword = req.query.password;
    var newPassword = "newpassword";
    var mainData;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    // await addPassword(collection, userID);
    mainData = await fetchdata(collection, userID);
    await createUser(collection, userID, mainData, website, newUsername, newPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
