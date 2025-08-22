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
    }).populate("fromUserId", ["firstName", "lastName"]);

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    loggedInUser = req.user;

    const connections = ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const data = (await connections).map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id))
        return connection.toUserId;

      return connection.fromUserId;
    });

    res.send({
      message: "Friendddssss!!!!",
      data,
    });
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

module.exports = userRouter;
