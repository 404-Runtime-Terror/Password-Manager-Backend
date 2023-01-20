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

  // flag to check if account is deleted
  var AccountDeleted = false;
  try {

    //Connecting to database
    await client.connect();
    const db = client.db("Users");
    const AccCollection = await db.collection("AccountData");
    const data = await collection.find().toArray();

    //Finding data as per _id
    data.find((e) => {

      // _id checking if it is equal to userID(given by user)
      if (e._id.toString() === userID)
       {

        //Deleting data from both database
        collection.deleteOne({ _id: ObjectId(userID) });
        AccCollection.deleteOne({ _id: ObjectId(userID) });
        
        //Setting flag to true
        AccountDeleted = true;
       }
    });

    //Returning flag
    return AccountDeleted;

    //if error occurs
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}


//get request
router.get("/", async (req, res) => {
  try {

    //getting userID from query
    var userID = req.query.userID;
    
    var value ;
    
    //Connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    
    //Calling fetchdata function get flag value
    value = await fetchdata(collection, userID);
    
    //value checking if it is true or false
    if (value === true){

      //sending response
      res.json({AccountDeleted : true}).status(200);
    }
    else{

      //sending response
      res.json({AccountDeleted : false}).status(200);
    }

    //if error occurs
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
