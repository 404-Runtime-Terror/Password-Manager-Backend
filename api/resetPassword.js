// Require modules
const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
});

//get request
router.get("/", async (req, res) => {
    try {
        // query parameters
        var password = req.query.password;
        var email = req.query.email;
        var ResetPass = 0;

        //connect to database
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("AccountData").aggregate().toArray();
        const AddCollection = db.collection("AccountData");

        //encryption
        const salt = await bcrypt.genSalt(10);
        
        // encrypt password
        Enpassword = await bcrypt.hash(password, salt);


        //check the username and email
        var found = collection.find((e) => {

            // if email and otp is not null
            if (e.email === email && e.otp !== null) {
                
                // set the flag if username and password is correct
                ResetPass = 1;

                // return the object
                return e;
            }
        }
        );

        // if email and otp is not null
        if (ResetPass == 1) {

            // update the password
            AddCollection.updateOne(
                { _id: found._id },
                { $set: { password: Enpassword, otp: null } }
            );

            // send the response
            res.status(200).json({ "message": "Password Reset",isReset: true });
        }
        else{

            // send the response
            res.status(200).json({"message":"Invalid Email",isReset: false});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;
