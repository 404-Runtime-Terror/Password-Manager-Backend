const express = require("express");
const cors = require("cors");
const signup = require("./api/signup");
const login = require("./api/login");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use("/api/signup", signup);

app.get("/", async (req, res) => {
  return res.status(200).send("Working");
});
//   var userkey = null;
//   try {
//     await client.connect();
//     // console.log(temp);

//     const db = client.db("Users");

//     console.log(req.query);

//     const collection = await db.collection("AccountData").aggregate().toArray();

//     if (collection[0].key === req.query.pass) {
//       res.json({ key: "successful" });
//     } else {
//       res.json({ key: "fail" });
//     }

//     userkey = collection[0].key;
//     console.log(userkey);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Server error");
//   }
// });

app.use("/api/login", login);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
