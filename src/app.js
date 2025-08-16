const express = require("express");
const app = express();

const connectDB = require("./Config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// connecting to database
connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(7777, () => {
      console.log("Server created successfully at port 7777");
    });
  })
  .catch((error) => {
    console.log("Database connection failed..." + error.message);
  });
