const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // const decodedObj = req.cookies;
    // const { token } = decodedObj;
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token!!!");
    }
    const userId = jwt.verify(token, "devTinder@2025");

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found...");
    }
    req.user = user;
    next();
  } catch (Error) {
    res.status(400).send("Error finding the user: "+ Error.message);
  }
};

module.exports = { userAuth };
