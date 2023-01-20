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
  var AccountDeleted = false;
  try {
    await client.connect();
    const db = client.db("Users");
    const AccCollection = await db.collection("AccountData");
    //Fecthing data from database
    const data = await collection.find().toArray();

    //Finding data as per _id
    data.find((e) => {
      if (e._id.toString() === userID)
       {
        collection.deleteOne({ _id: ObjectId(userID) });
        AccCollection.deleteOne({ _id: ObjectId(userID) });
        AccountDeleted = true;
       }
    });

    //Returning mainData
    return AccountDeleted;
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}


//get request
router.get("/", async (req, res) => {
  try {
    var userID = req.query.userID;
    // var userID = "63c836313739a268fe9984f6";
    var value ;
    
    //Connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("Password");
    
    value = await fetchdata(collection, userID);
    
    
    if (value === true){
      res.json({AccountDeleted : true}).status(200);
    }
    else{
      res.json({AccountDeleted : false}).status(200);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
