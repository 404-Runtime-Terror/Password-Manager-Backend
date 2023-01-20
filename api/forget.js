// Require modules
const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const nodeMailer = require("nodemailer");
const router = express.Router();
const bcrypt = require("bcryptjs");
require('dotenv').config();


router.get("/", async (req, res) => {
    // flag variable
    var flag = 0;

    // index of OTP in database
    var indexOtp;

    // array to store all ids and emails
    var id = [];
    var emails = [];

    var emailFound;
    
    // get email from query
    const email = req.query.email;

    // connect to database
    const client = new MongoClient(
        process.env.DB_URL, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("Users");
    const collection = await db.collection("AccountData").aggregate().toArray();
    const AddCollection = db.collection("AccountData");

    // get all emails from database
    collection.map((e, index) => {
        id[index] = e._id
        emails[index] = e.email
    })

    //encryption
    const salt = await bcrypt.genSalt(10);
    var OTP = Math.floor(100000 + Math.random() * 900000);
    console.log(OTP);
    

    // check if email is present in database
    for (let i = 0; i < emails.length; i++) {
        if (email === emails[i]) {
            flag = 1;
            emailFound = emails[i];
            indexOtp = id[i];
            console.log(indexOtp);
            break;
        }
    }

    // if email is present in database
    if (flag === 1) {
        AddCollection.updateOne(
            { _id: ObjectId(indexOtp) },
            { $set: { otp: OTP } },
        );

       
        // send email with OTP
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD
            }
        });
        
        // email format
        let details = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Forgot Password',
            html: `
            <p>Hi there,</p>
            <p>It looks like you requested a password reset. If you didn't make this request, you can ignore this email.</p>
            <p>To reset your password, enter the following OTP (one-time password) when prompted:</p>
            <p>
            <b>
            <div style="border: 2px solid black; padding: 10px; width: 150px; text-align: center;">
            ${OTP}
            </div>
            </b>
            </p>
            <p>This OTP will expire in 5 minutes. If you can't complete the password reset process in time, you'll need to request a new OTP.</p>
            <p>Thanks,</p>
            <p>The Your App Team</p>
            `
        };
        
        
        // send email
        transporter.sendMail(details, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
                res.json({ EmailSend : true });
            }
        });
        
    }
    // Timer to delete OTP from database
    setTimeout(function() {
        AddCollection.updateOne(
            { _id: ObjectId(indexOtp) },
            { $set: { otp: null } },
        );
      }, 1000*60*5);
});


module.exports = router;

