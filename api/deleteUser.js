//Require modules
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
    
    //if _id is equal to userID
    data.find((e) => {
      if (e._id.toString() === userID) {

        // storing data in mainData variable
        mainData = e;
      }
    });

    // returning mainData
    return mainData;

    // if error occurs
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

// delete user function
async function deleteUser(collection, userID, mainData, website, username) {
  var accounts;

  //flag variable
  var deleteUserDone = false;
  
  //total websites array
  var totWeb = [];
  try {

    // collecting all websites in total Website array
    mainData.passwords.find((e) => {
      totWeb.push(e.websites);
    })

    // finding website in mainData.passwords
    mainData.passwords.find((e) => {

      if (e.websites === website) {
        
        // storing accounts in accounts variable
        accounts = e.accounts;

        // if accounts length is greater than 1
        //  as the account length is more than 1 then it will directly delete the account without adding null
        if (accounts.length > 1) {

          // looping through accounts
          accounts.map((e, index) => {

            // if username is found
            if (e.username === username) {
              
              // deleting account
              accounts.splice(index, 1);

              // updating database
              collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
              
              //set flag variable is true
              deleteUserDone = true;
          
            }
            else{

              console.log("wrong username");
            }
          })
          
          // if accounts length is equal to 1
          // as the account length is equal to 1 then it will add null to the account so that the basic format is maintained
        } else if (accounts.length === 1) {
          
          // if total website available in database is only 1
          // then it will delete the website and add null to the website so that the basic format is maintained
          if (totWeb.length === 1) {

            // looping through accounts
            mainData.passwords.map((e) => {

              // if website is found
              if (e.websites === website) {

                // set it as "null"
                e.websites = "null";
              }
            })

            // looping through accounts
            accounts.map((e, index) => {

              // if username is found
              if (e.username === username) {

                // set it as "null"
                e.username = "null";
                e.password = "null";

                // updating flag variable to true
                deleteUserDone = true;

                // updating database
                collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
              }
            })
          }
          else {
            // if total website available in database is more than 1 the it will delete the website directly
            mainData.passwords.map((e, index) => {
              
              // if website is found
              if (e.websites === website) {
                
                // deleting website
                mainData.passwords.splice(index, 1);
                
                // set flag variable to true
                deleteUserDone = true;

                // updating database
                collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
              }
            })
          }
        }
        else{
          // if no accounts found
          console.log("no accounts found");
        }
      }
    });

    // returning flag variable
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

    // getting data from frontend
    var userID = req.query.userID;
    var website = req.query.website;
    var username = req.query.username;

    var mainData;
    
    // connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");

    // collecting data from database
    mainData = await fetchdata(collection, userID);

    // getting flag variable value
    value = await deleteUser(collection, userID, mainData, website, username);
    
    // if flag variable is true
    if (value) {

      // send response to frontend
      res.status(200).json({ deleteUser: true });
    }
    else {

      // send response to frontend
      res.status(200).json({ deleteUser: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
