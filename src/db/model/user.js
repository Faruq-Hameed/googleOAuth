const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstName: String,
  lastName: String,
  profilePhoto: String,
  password: String,
  source: {
    type: String,
    enum: ["google", "facebook", "formData"],
    required: [true, "source not specified"],
  },
  lastVisited: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
