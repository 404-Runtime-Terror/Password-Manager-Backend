const express = require("express");
const cors = require("cors");
const signup = require("./api/signup");
const login = require("./api/login");
const forget = require("./api/forget");
const ResetPass = require("./api/resetPassword");
const Verification = require("./api/Verfication");

const dashboard =  require("./api/dashboard");
const newUser = require("./api/newUser");
const newWebsite = require("./api/newWebsite");
const changePassword = require("./api/changePassword");
const deleteUser = require("./api/deleteUser");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  return res.status(200).send("Working");
});

app.use("/user/signup", signup);
app.use("/user/login", login);
app.use("/user/forget",forget);
app.use("/user/verification",Verification);
app.use("/user/reset",ResetPass);

app.use("/user/dashboard",dashboard);
app.use("/user/dashboard/newUser",newUser);
app.use("/user/dashboard/newWebsite",newWebsite);
app.use("/user/dashboard/changePassword",changePassword);
app.use("/user/dashboard/deleteUser",deleteUser);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
