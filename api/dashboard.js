// require modules
const { MongoClient,ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

//To fetch data from database as per _id
async function fetchdata(collection, userID) {
  var mainData;
  try {
    //Fecthing data from database
    const data = await collection.find().toArray();

    //Finding data as per _id
    data.find((e) => {
      if (e._id.toString() === userID)
       {

        //Storing data in mainData
        mainData = e;
       }
    });
    console.log(mainData);

    //Returning mainData
    return mainData;
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

//To Create First Username and Password for a website
async function createWebsite(collection, userID, mainData,website,username,password) {
  try{
    //Fetching passwords data from database
    mainData.passwords.find((e)=>{
      
      // Creating First Username and Password for a website
      e.websites = website;

      //Creating accounts array
      arrayPassword = e.accounts;
    })

      arrayPassword.find(e=>{

        //Creating First Username and Password for a website
        e.username = username;
        e.password = password;

      })
      //Updating database
      collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });
      return true;
    }
   catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

//get request
router.get("/", async (req, res) => {
  try {

    //Getting data from frontend UserID and website name, username and password
    var userID = req.query.userID;
    var website = req.query.website;
    var username = req.query.username;
    var password = req.query.password;

    var mainData ;
    
    //Connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    
    //Calling functions to fetch data and create website
    mainData = await fetchdata(collection, userID);
    value = await createWebsite(collection, userID, mainData,website,username,password);
    
    //if value is true then website is created
    if (value === true){
      res.json({website : true}).status(200);
    }
    //if value is false then website is not created
    else{
      res.json({website : false}).status(200);
    }
    // if any error occurs
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
