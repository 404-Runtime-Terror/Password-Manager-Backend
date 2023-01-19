
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
    return mainData;
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

async function deleteUser(collection, userID, mainData, website, username, password) {
  var accounts;
  var deleteUserDone = false;
  var totWeb = []
  try {
    mainData.passwords.find((e) => {
      totWeb.push(e.websites);
    })
    mainData.passwords.find((e) => {
      if (e.websites === website) {
        accounts = e.accounts;
        console.log(accounts.length);
        if (accounts.length > 1) {
          console.log("running7");
          accounts.map((e, index) => {
            if (e.username === username) {
              // console.log(index);
              console.log("running1");
              console.log(deleteUserDone);
              // delete the data
              accounts.splice(index, 1);

              collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
              deleteUserDone = true;
              console.log("running2");
              console.log(deleteUserDone);
            }
            else{
              console.log("wrong username");
            }
          })
          // console.log(totWeb.length)
        } else if (accounts.length === 1) {
          console.log("running6");
          console.log(totWeb.length)
          if (totWeb.length === 1) {
            mainData.passwords.map((e) => {
              if (e.websites === website) {
                e.websites = "null";
              }
            })
            accounts.map((e, index) => {
              if (e.username === username) {
                e.username = "null";
                e.password = "null";

                console.log("running4");
                deleteUserDone = true;
                collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });

                console.log("running5");
                console.log(deleteUserDone);
              }
            })
          }
          else {
            mainData.passwords.map((e, index) => {
              console.log(e.websites);
              if (e.websites === website) {
                console.log("running3");
                mainData.passwords.splice(index, 1);
                deleteUserDone = true;
                collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
              }
            })
          }
        }
        else{
          console.log("no accounts found");
        }
      }


    });
    console.log(totWeb.length);
    return deleteUserDone;
  }
  catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}
//get request
router.get("/", async (req, res) => {
  try {
    var userID = req.query.userID;
    // var userID = "63c6befa784b473173e4f3df";
    var website = req.query.website;
    // var website = "email";
    var username = req.query.username;
    // var username = "newuser";

    var mainData;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");

    mainData = await fetchdata(collection, userID);
    value = await deleteUser(collection, userID, mainData, website, username);
    console.log(value);
    if (value) {
      res.status(200).json({ deleteUser: true });
    }
    else {
      res.status(200).json({ deleteUser: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
