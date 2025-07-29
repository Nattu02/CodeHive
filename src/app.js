const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("reponse sent from home page...");
});

app.listen(7777, () => {
  console.log("Server created successfully at port 7777");
});
