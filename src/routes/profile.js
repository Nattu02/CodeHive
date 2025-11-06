const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const userAuth = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    const { firstName, lastName, gender, age, skills, profile, role, about } =
      user;
    res.json({
      firstName,
      lastName,
      gender,
      age,
      skills,
      profile,
      role,
      about,
    });
  } catch (err) {
    res.status(401).send("Unauthorized user");
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "gender",
      "skills",
      "profile",
      "role",
      "about",
    ];
    const newUserData = req.body;
    const isAllowed = Object.keys(newUserData).every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isAllowed) throw new Error("Invalid data entered");
    const loggedInUser = req.user;

    const updatedUserData = Object.assign(loggedInUser, newUserData);

    await updatedUserData.save();
    const { firstName, lastName, gender, age, skills, profile, role, about } =
      updatedUserData;
    res.json({
      message: "Profile updated successfully...",
      data: { firstName, lastName, gender, age, skills, profile, role, about },
    });
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      throw new Error("error updating password");
    const isPasswordMatch = await user.validatePassword(oldPassword);

    if (!isPasswordMatch) throw new Error("Existing passowrd does not match..");
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const isNewPasswordSame = await user.validatePassword(newPassword);

    if (isNewPasswordSame)
      throw new Error(
        "New passowrd cannot be the same as the existing one... "
      );

    user.password = newPasswordHash;
    await user.save();

    res.send("Password updated successfully!!!");
  } catch (err) {
    res.status(400).send("Error updating passowrd. " + err.message);
  }
});

module.exports = profileRouter;
