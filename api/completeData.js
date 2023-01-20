//Require modules
const { MongoClient} = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
  useUnifiedTopology: true,
});

//fetch data from database
async function fetchData(userID) {

  try {

    // storing Database data in data variable
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();
    
    // finding data as per _id 
    collection.find((e) => {

      // _id checking if it is equal to userID(given by user)
      if (e._id.equals(userID)) {

        // storing data in mainData variable
        data = e;
      }
    });

    // returning Data
    return data;

    // if error occurs
  } catch (error) {
    console.error(error);
  }
}

router.get("/", async (req, res) => {
  try {
    // getting userID from query
    userID = req.query.userID;
    
    // flag variable
    var flag = false;

    //connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password").aggregate().toArray();
    
    // _id checking if it is equal to userID(given by user)
    collection.find(e => {
      if ((e._id).equals(userID)) {

        // storing data in passwordData variable getting fetched from password collection
        passwordData =  e ;

        // flag is true
        flag = true;
      }
    }
    )

    // if flag is true
    if (flag) {

      // storing data in UserInfo variable getting fetched from AccountData collection
      const UserInfo = await fetchData(userID);

      // returning UserInfo and passwordData
      return res.status(200).json({UserInfo, passwordData});

    }

    //if any error occurs
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
