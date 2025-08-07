const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");

const userAuth = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    // console.log(_id);

    await User.findByIdAndUpdate(_id, { age: 40 });

    res.send("Profile updated successfully...");
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
  }
});

module.exports = profileRouter;
