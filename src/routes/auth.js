const express = require("express");

const authRouter = express.Router();
const { validateSignUp } = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

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
    res.send("User created successfully");
  } catch (err) {
    res.send("Error in creating new user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(401).send("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const jwtoken = user.getJWT();
      res.cookie("token", jwtoken);
      const { firstName, lastName, gender, age, skills, profile } = user;
      res.json({ firstName, lastName, gender, age, skills, profile });
    } else res.status(401).send("Invalid credentials");
  } catch (err) {
    res.send("Something went wrong: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out successfully...");
});

module.exports = authRouter;
