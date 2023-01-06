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
        console.log(req.query);
        await client.connect();
        const db = client.db("Users");
        const collection = await db.collection("AccountData").aggregate().toArray();
        if (req.query.userName == collection.map((e,index)=>{
            e.userName[index] 
        })) 
        {
            console.log("hi");
        }
        console.log(username);
        console.log(passwords);
        return res.json(collection);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;