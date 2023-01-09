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
        var password = req.query.password;
        // var password = "1235";
        var email = req.query.email;
        // var email = "aryanbhisikar02@gmail.com";
        var ResetPass = 0;
        // console.log(email);

        //connect to database
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("AccountData").aggregate().toArray();
        const AddCollection = db.collection("AccountData");

        //encryption
        const salt = await bcrypt.genSalt(10);
        Enpassword = await bcrypt.hash(password, salt);

        //Encrypted password
        // const EnPassword = password;

        //check the username and email
        var found = collection.find((e) => {
            // console.log(e.email)
            if (e.email === email && e.otp !== null) {
                ResetPass = 1;
                return e;
            }
        }
        );
        // console.log(found);

        if (ResetPass == 1) {
            AddCollection.updateOne(
                { _id: found._id },
                { $set: { password: Enpassword, otp: null } }
            );
            res.status(200).json({ "message": "Password Reset" });
        }
        else{
            res.status(200).json({"message":"Invalid Email"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;
