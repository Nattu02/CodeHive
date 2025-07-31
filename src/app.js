const express = require("express");
const app = express();

const connectDB = require("./Config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const user = new User(req.body);

  try {
    await user.save();
    console.log("user created successfully");
    res.send("User created successfully");
  } catch (err) {
    res.send("Error in creating new user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(7777, () => {
      console.log("Server created successfully at port 7777");
    });
  })
  .catch((error) => {
    console.log("Database connection failed..." + error.message);
  });
