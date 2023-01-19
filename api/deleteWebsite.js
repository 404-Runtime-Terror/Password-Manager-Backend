
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const router = express.Router();
require("dotenv").config();

//connect to mongodb database
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
});

async function fetchdata(collection, userID) {
    var mainData;
    try {
        const data = await collection.find().toArray();
        data.find((e) => {
            if (e._id.toString() === userID) {
                mainData = e;
            }
        });
        return mainData;
    } catch (error) {
        console.log(error)
        return res.status(500).send("Server error");
    }
}

async function deleteWebsite(collection, userID, mainData, website, username, password) {
    var accounts;
    var deleteWebDone = false;
    var totWeb = [];
    var gotIndex;
    try {
        mainData.passwords.find((e) => {
            totWeb.push(e.websites);
        })
        mainData.passwords.find((e,index1) => {
            if (e.websites === website) {
                gotIndex = index1;
                console.log(e.websites);
                if (totWeb.length === 1) {
                    
                    e.websites = "null";
                    accounts = e.accounts;
                    console.log(accounts.length );
                    accounts.splice(0, accounts.length-1);
                    console.log(accounts.length );
                    accounts.find((e) => {
                        e.username = "null";
                        e.password = "null";
                    })
                    deleteWebDone = true;
                    collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
                }else{
                        mainData.passwords.splice(gotIndex, 1);
                        deleteWebDone = true;
                        collection.updateMany({ _id: ObjectId(userID) }, { $set: { passwords: mainData.passwords } });
                }
            }
        })
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
        var userID = req.query.userID;
        // var userID = "63c6befa784b473173e4f3df";
        var website = req.query.website;
        // var website = "email";
        var username = req.query.username;
        // var username = "newuser";

        var mainData;
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("Password");

        mainData = await fetchdata(collection, userID);
        value = await deleteWebsite(collection, userID, mainData, website, username);
        console.log(value);
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
