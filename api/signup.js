const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
require('dotenv').config();

const client = new MongoClient(
    process.env.DB_URL
);

//     res.json({ key: true });
router.get("/", async (req, res) => {
    try {
        var usernames = [];
        var passwords = []
        console.log(req.query);
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("AccountData").aggregate().toArray();
        collection.map((e,index)=>{
            usernames[index] = e.userName
            // passwords[index] = e.password
        })
        // if (req.query.username == usernames.map((index)=>{
        //     usernames[index]
        // })) 
        // {
            // console.log("hi");
        // }
        // console.log(username);
        // console.log(passwords);
        return res.json(collection);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;