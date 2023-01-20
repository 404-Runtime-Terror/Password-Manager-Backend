// Require modules
const { MongoClient,ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

// fetch data from database
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

// new website function
async function newWebsite(collection, userID, mainData, website, username, password) {
  
  // Created a flag variable name websiteExists
  var websiteExists = false;
    try{

      // finding website in mainData.passwords
        mainData.passwords.find((e)=>{
            if(e.websites === website)
            {
              // if website is found then set websiteExists to true
                websiteExists = true;
            }
        });

        // if website is not found
        if(websiteExists === false)
        {
          // push website and username and password in mainData.passwords
            mainData.passwords.push({websites:website,accounts:[{username:username,password:password}]});

            // update database
            collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });

            return true;
        }
        else{
          // if website is found
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

    // storing userID, website, username, password in variables
    var userID = req.query.userID;
    var website = req.query.website;
    var username = req.query.username;
    var password = req.query.password;
    
    var mainData ;

    // connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    
    // calling fetchdata function
    mainData = await fetchdata(collection, userID);
    
    // getting flag value from newWebsite function
    value = await newWebsite(collection, userID, mainData,website,username,password);
    
    // if flag value is true
    if(value === true)
    {
        // return webCreate as true
        return res.status(200).json({webCreate: true});
    }
    else{
      
        // return webCreate as false
        return res.status(200).json({webCreate: false});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
