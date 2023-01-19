
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
    var websiteExists = false;
    try{
        console.log(mainData.passwords);
        mainData.passwords.find((e)=>{
            if(e.websites === website)
            {
                websiteExists = true;
            }
        });
        if(websiteExists === false)
        {
            mainData.passwords.push({websites:website,accounts:[{username:username,password:password}]});
            collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });
            return true;
        }
        else{
            console.log("Website already exists");
            return false;
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
    var userID = req.query.userID;
    // var userID = "63c8335cc61868d253fca584";
    var website = req.query.website;
    // var website = "google";
    var username = req.query.username;
    // var username = "newuser";
    var password = req.query.password;
    // var password = "newpassword";
    var mainData ;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    // await addPassword(collection, userID);
    
    mainData = await fetchdata(collection, userID);
    value = await newWebsite(collection, userID, mainData,website,username,password);
    
    if(value === true)
    {
        return res.status(200).json({webCreate: true});
    }
    else{
        return res.status(200).json({webCreate: false});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
