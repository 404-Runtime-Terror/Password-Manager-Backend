const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require('dotenv').config();

//connect to mongodb database
const client = new MongoClient(
    process.env.DB_URL, { useUnifiedTopology: true });

//get request
router.get("/", async (req, res) => {
    try {
        var usernames = [];
        var email = [];
        var flag = 0;

        //connect to database
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("AccountData").aggregate().toArray();
        const AddCollection = db.collection("AccountData")
        
        //encryption
        const salt = await bcrypt.genSalt(10);
        req.query.password = await bcrypt.hash(req.query.password, salt);
        
        //Encrypted password
        const EnPassword = req.query.password;
        console.log(EnPassword);
        
        //check the username and email
        collection.map((e, index) => {
            usernames[index] = e.userName
            email[index] = e.email
        })

        //compare the username and email
        usernames.map((e, index) => {
            const UserInputEmail = email[index];
            if (req.query.username == usernames[index]
                && req.query.email == UserInputEmail) {
                flag = 1;
            }
        })


        if (flag == 1) {
            res.json({ key: true });
        }
        else {
            // switch for insert data
            // if (req.query.conform == "yes")
            
            {
                //insert data into database if username and email is not exist
                AddCollection.insertOne({ userName: req.query.username, email: req.query.email ,password: EnPassword }, (err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Document inserted!');
                });
            }
            
            // after deleting switch delete below else 
            // else {
                // res.json({ key: false });
            // }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;