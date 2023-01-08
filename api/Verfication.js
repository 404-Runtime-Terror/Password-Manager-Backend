const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcryptjs");
require('dotenv').config();

//connect to mongodb database
const client = new MongoClient(
  process.env.DB_URL, { useUnifiedTopology: true });

//get request  
router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    const UserOtp = req.query.otp;

    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();


    var found = collection.find((e)=>{
         if(e === email);
         {
            return e;
         }
    });
    
    if (parseInt(UserOtp) === parseInt(found.otp))
    {
        res.json({ Verified: true });
    }
    else{
        res.json({ Verified: false });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
