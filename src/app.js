const express = require("express");
const app = express();
const mongoose = require("mongoose");

const connectDB = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const { upload } = require("./Config/cloudinary");

app.use(
  cors({
    origin: ["http://13.233.102.100", "http://localhost:5173"],
    credentials: true,
  })
);
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
////////////////////////////////////////////////////////////////////
const Image = mongoose.model(
  "Image",
  new mongoose.Schema({
    url: String,
    public_id: String,
  })
);

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Uploaded file info:", req.file);

    const newImg = new Image({
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename,
    });

    await newImg.save();

    res.json({ success: true, imageUrl: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

////////////////////////////////////////////////////////////////////

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
