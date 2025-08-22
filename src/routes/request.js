const express = require("express");

const userAuth = require("../middlewares/auth");
const requestRouter = express.Router();
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        throw new Error("User not found");
      }
      const fromUserId = user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const isStatusAllowed = ["interested", "ignored"].includes(status);

      if (!isStatusAllowed) {
        return res.status(400).json({
          message: "Status type invalid",
        });
      }

      const toUSer = await User.findById(toUserId);
      if (!toUSer) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fromUserId.equals(toUserId)) {
        console.log("asdfasdfasfd");
        return res
          .status(400)
          .json({ message: "You cannot send request to yourself!!" });
      }

      const existingConnection = await connectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "Connection already exists",
        });
      }

      const connection = new connectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });
      await connection.save();

      res.send(user.firstName + " sent a connection request");
    } catch (err) {
      res.status(400).send("Cannot send request: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const connectionId = req.params.requestId;
      const status = req.params.status;

      const isStatusAllowed = ["accepted", "rejected"].includes(status);

      if (!isStatusAllowed) {
        return res.json({ message: "Invalid status type" });
      }

      const connection = await connectionRequest.findOne({
        _id: connectionId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connection) {
        return res.json({ message: "Connection not exist" });
      }

      connection.status = status;
      const updatedConnection = await connection.save();

      res.json({
        message: "Connection request " + status + " successfully..",
        updatedConnection,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
