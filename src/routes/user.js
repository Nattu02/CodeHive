const express = require("express");
const userRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (pendingRequests.length === 0) {
      return res.json({ message: "No pending connections at the moment" });
    }

    res.json({
      message: "Pending requests fetched successfully",
      pendingRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
