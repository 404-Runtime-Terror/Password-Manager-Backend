// Require modules
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

        data.find((e) => {
            // if _id is equal to userID
            if (e._id.toString() === userID) {

                // storing data in mainData variable
                mainData = e;
            }
        });

        // returning mainData
        return mainData;
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server error");
    }
}

// delete website function
async function deleteWebsite(collection, userID, mainData, website) {
    var accounts;
    // flag variable
    var deleteWebDone = false;

    // array to store all websites
    var totWeb = [];

    // index of website
    var gotIndex;
    try {

        // collecting all websites in total Website array
        mainData.passwords.find((e) => {
            totWeb.push(e.websites);
        })

        // finding website in mainData.passwords
        mainData.passwords.find((e, index1) => {

            // if website is found
            if (e.websites === website) {
                
                // saving index of website
                gotIndex = index1;

                // if there is only one website then set it to null to maintain database structure
                if (totWeb.length === 1) {
                    // set website to null
                    e.websites = "null";

                    // accounts array
                    accounts = e.accounts;

                    // delete the account data till the data saved in account is only one username and password
                    accounts.splice(0, accounts.length - 1);
                    
                    // set username and password to null
                    accounts.find((e) => {
                        e.username = "null";
                        e.password = "null";
                    })

                    // set deleteWebDone to true
                    deleteWebDone = true;

                    // update database
                    collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
                } else {
                    // if there are more than one website then delete the website
                    mainData.passwords.splice(gotIndex, 1);

                    // set deleteWebDone to true
                    deleteWebDone = true;

                    // update database
                    collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
                }
            }
        })

        // return deleteWebDone flag variable
        return deleteWebDone;
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("Server error");
    }
}
//get request
router.get("/", async (req, res) => {
    try {

        // getting userID, website, username and password from query
        var userID = req.query.userID;
        var website = req.query.website;

        var mainData;

        // connecting to database
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("Password");

        // fetching data from database
        mainData = await fetchdata(collection, userID);
        
        // getting deleteWebDone flag variable
        value = await deleteWebsite(collection, userID, mainData, website);
        
        // if deleteWebDone is true then send deleteWebDone as true
        if (value) {
            res.status(200).json({ deleteWeb: true });
        }
        else {
            res.status(200).json({ deleteWeb: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;
