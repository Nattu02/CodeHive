const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate: {
      validator: function (value) {
        return ["male", "female", "others"].includes(value);
        // return value === "male"
      },
      message: (props) => `${props.value} is not a valid gender`,
    },
  },
  profile: {
    type: String,
    default:
      "https://tse3.mm.bing.net/th/id/OIP.3gBvmi-7wOgLMugWQE2GqQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  skills: {
    type: Array,
    validate: {
      validator: (arr) => arr.length >= 2,
      message: "The number of skills should be greater than 2",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
