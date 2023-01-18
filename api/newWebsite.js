
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

async function newWebsite(collection, userID, mainData, website, username, password) {
    var flag = 0;
    try{
        console.log(mainData.passwords);
        mainData.passwords.find((e)=>{
            if(e.websites === website)
            {
                flag = 1;
            }
        });
        if(flag !== 1)
        {
            mainData.passwords.push({websites:website,accounts:[{username:username,password:password}]});
            collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });
        }
        else{
            console.log("Website already exists");
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
    var website = "google";
    // var username = req.query.username;
    var username = "newuser";
    // var password = req.query.password;
    var password = "newpassword";
    var mainData ;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    // await addPassword(collection, userID);
    mainData = await fetchdata(collection, userID);
    await newWebsite(collection, userID, mainData,website,username,password);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
