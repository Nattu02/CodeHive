const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello hello hello...");
});

app.use("/test2/2", (req, res) => {
  res.send("this is test2 route");
});

app.use("/test", (req, res) => {
  res.send("this is test route");
});

app.get("/user", (req, res) => {
  res.send({
    fname: "Nattudurai",
    lname: "C",
  });
});

app.post("/user", (req, res) => {
  res.send("User data created successfully");
});
app.put("/user", (req, res) => {
  res.send("User data updated successfully");
});
app.delete("/user", (req, res) => {
  res.send("User data deleted successfully");
});

app.use("/", (req, res) => {
  res.send("reponse sent from home page...");
});

app.listen(7777, () => {
  console.log("Server created successfully at port 7777");
});
