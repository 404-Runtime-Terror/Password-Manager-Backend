
const { MongoClient,ObjectId } = require("mongodb");
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
      if (e._id.toString() === userID)
       {
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

async function deleteUser(collection, userID, mainData, website, username, password) {
    var accounts;
    try{
        mainData.passwords.find((e)=>{
            if(e.websites === website)
            {
                accounts = e.accounts;
                console.log(accounts);
                accounts.map((e,index)=>{
                    if(e.username === username)
                    {
                        console.log(index);
                        accounts.splice(index,1);
                    }
                })
            }
        });
        collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });
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
    // var username = req.query.username;
    var username = "user1";

    var mainData ;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    mainData = await fetchdata(collection, userID);
    await deleteUser(collection, userID, mainData,website,username);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
