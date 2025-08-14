const express = require("express");
const connectionRequest = require("../models/connectionRequest");

const userAuth = require("../middlewares/auth");
const requestRouter = express.Router();
const User = require("../models/user");

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

module.exports = requestRouter;
