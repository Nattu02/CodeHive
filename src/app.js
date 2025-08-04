const express = require("express");
const app = express();

const connectDB = require("./Config/database");
const User = require("./models/user");

const validator = require("validator");

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

app.get("/getuser", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const result = await User.findOne({ emailId: userEmail });
    res.send(result);
  } catch (err) {
    res.status(400).send("Cannot find user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(400).send("Cannot fetch users");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send("Something went wrong: " + err.message);
  }
});

app.put("/replace", async (req, res) => {
  const filtermail = req.body[0];
  // console.log(req.body);
  const newUSer = req.body[1];
  try {
    await User.findOneAndReplace(filtermail, newUSer);
    res.send("User replaced successfully");
  } catch (error) {
    req.send("Error replacing user");
  }
});

app.patch("/update/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_FIELDS = ["age", "skills", "gender", "profile", "emailId"];
    if (data?.skills?.length > 5)
      throw new Error("Skills cannot be more than 5");
    const email = data?.emailId;
    if (!validator.isEmail(email)) throw new Error("Email is not valid");

    const isAllowed = Object.keys(data).every((k) =>
      ALLOWED_FIELDS.includes(k)
    );

    if (!isAllowed) throw new Error("Chosen fields cannot be updated");

    await User.findByIdAndUpdate(userId, data);
    res.send("User updated successfully");
  } catch (error) {
    res
      .status(400)
      .send("Something went wrong updating user: " + error.message);
  }
});

// connecting to database
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
