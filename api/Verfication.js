// Require modules
const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
require('dotenv').config();

//connect to mongodb database
const client = new MongoClient(
  process.env.DB_URL, { useUnifiedTopology: true });

//get request  
router.get("/", async (req, res) => {
  try {
    // getting query
    const email = req.query.email;
    const UserOtp = req.query.otp;

    // connecting to database
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();

    // finding data as per email
    var found = collection.find((e)=>{
         if(e.email == email)
         {
            return e;
         }
    });
    // given otp and otp in database is same
    if (parseInt(UserOtp) === parseInt(found.otp))
    {
        // updating verified to true
        res.status(200).json({ Verified: true});
    }
    else{
        // updating verified to false
        res.status(200).json({ Verified: false });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
