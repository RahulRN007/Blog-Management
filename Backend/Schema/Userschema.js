const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmpassword: {
    type: String,
    required: true
  },
  profileImage: {
    type: String, // Stores filename like "abc.jpg"
    default: ""
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "deactive"]
  },
  logintime: {
    type: Date,
    default: Date.now
  },
  followedBy:{
    type: mongoose.Schema.Types.ObjectId,
  }
});

module.exports = mongoose.model("User", userSchema);
