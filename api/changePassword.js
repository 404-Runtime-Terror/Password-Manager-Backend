
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
    return mainData;
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

async function changePass(collection, userID, mainData, website, username, password) {
  var passwordExists = false;  
  var accounts;
    try{
        mainData.passwords.find((e)=>{
            if(e.websites === website)
            {
                accounts = e.accounts;
                accounts.find((e)=>{

                if(e.username === username)
                {
                    passwordExists = true;
                    e.password = password;
                }
                else{
                    passwordExists = false;
                }
            });
            }
        });
        collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });
        return passwordExists;
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
    var userID = "63c836313739a268fe9984f6";
    // var website = req.query.website;
    var website = "google";
    // var username = req.query.username;
    var username = "emailUser";
    // var password = req.query.password;
    var password = "password";
    
    var mainData ;
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    
    mainData = await fetchdata(collection, userID);
    value = await changePass(collection, userID, mainData, website, username, password);

    if(value === true){
        console.log("Password changed");
        return res.status(200).json({passwordChange : true });
    }
    else{
      console.log("Password not changed");
      return res.status(400).json({passwordChange : false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
