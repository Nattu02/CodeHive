const express = require("express");
const userRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/request/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "profile",
      "age",
      "gender",
    ]);

    if (pendingRequests.length === 0) {
      return res.json({
        message: "No pending connection requests at the moment",
        pendingRequests: pendingRequests || [],
      });
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
      .populate("fromUserId", "firstName lastName profile")
      .populate("toUserId", "firstName lastName profile");

    const data = (await connections).map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id))
        return connection.toUserId;

      return connection.fromUserId;
    });

    res.send(data);
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    limit = limit < 50 ? limit : 50;

    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    let hiddenUsers = new Set();

    connectionRequests.forEach((connection) => {
      hiddenUsers.add(connection.fromUserId.toString());
      hiddenUsers.add(connection.toUserId.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName age gender profile")
      .skip(skip)
      .limit(limit);

    res.send(feed);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
