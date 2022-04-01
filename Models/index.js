const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Please enter your name!"], 
      default: '',
      trim: true,
    },
    email: {
      type: String,
      // required: [true, "Please enter your email!"],
      trim: true,
      default: '',

    },
    password: {
      type: String,
      // required: [true, "Please enter your password!"], 
      default: ''
      // required: true
    },
    

    role: {
      type: Number,
      default: 0,
    },
    
    
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
  }
  },
  {
    timestamps: true,
  },

);

module.exports = mongoose.model("Users", userSchema);
