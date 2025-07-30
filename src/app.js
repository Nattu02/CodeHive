const express = require("express");
const app = express();

const { auth } = require("./middlewares/auth");

// app.use("/admin", (req, res, next) => {
//   const token = "xyz";
//   const isTokenValid = token === "xyz";
//   console.log("Admin authorized");

//   if (isTokenValid) res.send("admin authorized successfully");
//   // next();
//   else res.status(401).send("Authorization error");
// });

app.use("/admin", auth);

app.post("/admin/getUserData", (req, res) => {
  res.send("User data fetched successfully");
});

app.use("/admin/deleteUserData", (req, res) => {
  res.send("User data deleted successfully");
});

app.listen(7777, () => {
  console.log("Server created successfully at port 7777");
});
