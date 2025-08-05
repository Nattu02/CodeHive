const express = require("express");
const app = express();

const connectDB = require("./Config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { validateSignUp } = require("./utils/validate");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validate the data
    validateSignUp(req);

    //encrypt the passowrd

    //add user to DB
    const { firstName, lastName, emailId, password, age, gender, skills } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills,
    });
    await user.save();
    console.log("user created successfully");
    res.send("User created successfully");
  } catch (err) {
    res.send("Error in creating new user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const jwtoken = jwt.sign({ _id: user._id }, "devTinder@2025");
      res.cookie("token", jwtoken);
      res.send("Login successful!!!");
    } else throw new Error("Invalid crendentials");
  } catch (err) {
    res.send("Something went wrong: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong : " + err);
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
