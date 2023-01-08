const express = require("express");
const cors = require("cors");
const signup = require("./api/signup");
const login = require("./api/login");
const forget = require("./api/forget");
const Verfication = require("./api/Verfication");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use("/api/signup", signup);

app.get("/", async (req, res) => {
  return res.status(200).send("Working");
});

app.use("/api/login", login);
app.use("/api/forget",forget);
app.use("/api/Verfication",Verfication);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
