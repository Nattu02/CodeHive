const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nattudurai:Nattu8626@practice.plnh4xg.mongodb.net/devTinder?retryWrites=true&w=majority&appName=practice"
  );
};

module.exports = connectDB;
