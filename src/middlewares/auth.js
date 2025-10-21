const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
    const userId = jwt.verify(token, "devTinder@2025");

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (Error) {
    res.send("Error finding the user: " + Error.message);
  }
};

module.exports = userAuth;
