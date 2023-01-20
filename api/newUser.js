// Require modules
const { MongoClient, ObjectId } = require("mongodb");
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
    const data = await collection.find().toArray();

    // Finding data as per _id
    data.find((e) => {
      if (e._id.toString() === userID) {

        // Storing data in mainData
        mainData = e;
      }
    });

    // Returning mainData
    return mainData;
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

//To add new user to website
async function createUser(collection, userID, mainData, website, Newusername, Newpassword) {
  var accounts; 
  
  //To check if website exists and if username is new
  var newName = true;

  // Flag To check if website exists 
  var websiteExists;
  try {

    //check if website exists
    mainData.passwords.find((e) => {
      if (e.websites === website) {

        // if website exists set websiteExists to true
        websiteExists = true;
        
        //check if username is new by comparing with all usernames 
        //so to store all usernames in accounts
        accounts = e.accounts;
        console.log(accounts);

        // looping through accounts
        accounts.find((e,index) => {
          console.log(e.username)
          
          // if username is not new set newName to false
          if (e.username === Newusername) {
            
            //if username is not new
            newName = false;
          }
        });
      }
    });

    //newName is true if username is new and website exists
    if (newName === true) {

      //push new username and password to accounts
      accounts.push({ username: Newusername, password: Newpassword });
      
      //update database
      collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
      
      //return status
      return [{newName : newName}];
    }
    else {
      console.log("Username already exists");
      
      //return status
      return [{newName: newName}];
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

    // get userID, website, username and password from query
    var userID = req.query.userID;
    var website = req.query.website;
    var newUsername = req.query.username;
    var newPassword = req.query.password;
    
    var mainData;
    
    //connect to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");

    //fetch data from database
    mainData = await fetchdata(collection, userID);
    
    //create new user
    value= await createUser(collection, userID, mainData, website, newUsername, newPassword);
    console.log(value);

    //return status
    if (value[0].newName === true) {

      console.log("User created");
      
      return res
      .status(200)
      .json({newUser : true});
    }
    else{
      
      console.log("User not created");
      
      return res
      .status(400)
      .json({newUser : false});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
