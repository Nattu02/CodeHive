const mongoose = require("mongoose");
require("dotenv").config();


const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://" +
      username +
      ":" +
      password +
      "@practice.plnh4xg.mongodb.net/devTinder?retryWrites=true&w=majority&appName=practice"
  );
};

module.exports = connectDB;


