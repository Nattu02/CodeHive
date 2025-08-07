const express = require("express");

const userAuth = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user.firstName + " sent a connection request");
  } catch (err) {
    res.status(400).send("Cannot send request: " + err.message);
  }
});

module.exports = requestRouter;
