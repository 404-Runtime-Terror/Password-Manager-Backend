// Require modules
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

//fetch data from database
async function fetchdata(collection, userID) {
  var mainData;

  try {

    // storing Database data in data variable
    const data = await collection.find().toArray();
    data.find((e) => {

      //_id checking if it is equal to userID
      if (e._id.toString() === userID) {

        // storing data in mainData variable
        mainData = e;
      }
    });

    // returning mainData
    return mainData;
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

// change password function
async function changePass(collection, userID, mainData, website, username, password) {

  // passwordExists 
  var passwordExists = false;
  var accounts;

  try {

    // finding website in mainData.passwords
    mainData.passwords.find((e) => {

      // if website is found
      if (e.websites === website) {
        // storing accounts in accounts variable
        accounts = e.accounts;
        accounts.map((e) => {

          // if username is found
          if (e.username === username) {
            // passwordExists is true and password is changed
            passwordExists = true;
            e.password = password;
            // updating database with new password
            collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
          }
        });
      }
    });
    
    
    // returning passwordExists
    return passwordExists;
  }
  // catching error
  catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}
//get request
router.get("/", async (req, res) => {
  try {
    // getting userID, website, username and password from req.query

    var userID = req.query.userID;
    var website = req.query.website;
    var username = req.query.username;
    var password = req.query.password;

    var mainData;

    // connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");

    // collect all data from database and store it in mainData
    mainData = await fetchdata(collection, userID);

    //pass collection, userID, mainData, website, username, password to changePass function
    value = await changePass(collection, userID, mainData, website, username, password);

    // if password is changed
    if (value === true) {
      console.log("Password changed");

      // return passwordChange: true
      return res.status(200).json({ passwordChange: true });
    }
    // if password is not changed
    else {
      console.log("Password not changed");

      // return passwordChange: false
      return res.status(400).json({ passwordChange: false });
    }
    // catching error
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
