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
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const jwtoken = user.getJWT();
      res.cookie("token", jwtoken);
      res.send("Login successful!!!");
    } else throw new Error("Invalid crendentials");
  } catch (err) {
    res.send("Something went wrong: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out successfully...");
});

module.exports = authRouter;
