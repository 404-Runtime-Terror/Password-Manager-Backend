const express = require("express");
const cors = require("cors");
const signup = require("./api/signup");
const login = require("./api/login");
const forget = require("./api/forget");
const ResetPass = require("./api/resetPassword");
const Verification = require("./api/Verfication");
const dashboard =  require("./api/dashboard");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use("/user/signup", signup);

app.get("/", async (req, res) => {
  return res.status(200).send("Working");
});

app.use("/user/login", login);
app.use("/user/forget",forget);
app.use("/user/verification",Verification);
app.use("/user/reset",ResetPass);
app.use("/user/dashboard",dashboard);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
