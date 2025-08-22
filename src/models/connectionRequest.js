const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: String,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequest.methods.checkUserIds = function (fromUserId, toUserId) {
  if (fromUserId.equals(toUserId))
    throw new Error("Sender Id and receiver Id cannot be the same");
};

// connectionRequest.pre("save", function (next) {
//   if (this.fromUserId.equals(this.toUserId)) {
//     return next(new Error("Cannot send request to yourself..."));
//   }
//   next();
// });

module.exports = mongoose.model("ConnectionRequests", connectionRequest);
