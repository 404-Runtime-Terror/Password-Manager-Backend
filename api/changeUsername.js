
//Require modules
const { MongoClient,ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

//fetch data from database
async function fetchdata(collection, userID) {

  //mainData
  var mainData;
  try {

    // storing Database data in data variable
    const data = await collection.find().toArray();

    // finding data as per _id
    data.find((e) => {
      if (e._id.toString() === userID)
       {
        // storing data in mainData variable
          mainData = e;
       }
    });

    // returning mainData
    return mainData;

    // if error occurs
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
}

// change password function with parameters collection, userID, mainData, website, username, password
async function changeUser(collection, userID, mainData, website, username, newUsername) {

  // Created a flag variable name usernameExists
  var usernameExists = false;  
  var accounts;
    try{

      // finding website in mainData.passwords
        mainData.passwords.find((e)=>{

          // if website is found
            if(e.websites === website)
            {
              // storing accounts in accounts variable
                accounts = e.accounts;

                // finding username in accounts
                accounts.map((e)=>{

                  // if username is found
                if(e.username === username)
                { 
                  // if created flag is true
                    usernameExists = true;

                    // username is changed as per newUsername given
                    e.username = newUsername;

                  }
                });
              }
            });
            
          // updating database with new username
        collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords : mainData.passwords } });
        // returning flag value
        return usernameExists;
    }

    // if error occurs
    catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
    }
}
//get request
router.get("/", async (req, res) => {
  try {

    // storing userID, website, username, newUsername in variables given by user
    var userID = req.query.userID;
    var website = req.query.website;
    var username = req.query.username;
    var newUsername = req.query.newUsername;

    var mainData ;

    // connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    
    // calling fetchdata function and storing data in mainData variable
    mainData = await fetchdata(collection, userID);

    //calling changeUser function, storing value in value variable and returning flag status
    value = await changeUser(collection, userID, mainData, website, username, newUsername);

    // if flag is true
    if(value === true){

      // returning flag status
        return res.status(200).json({usernameChange : true });
    }
    else{

      // returning flag status
      return res.status(400).json({usernameChange : false });
    }

    //if error occurs
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
