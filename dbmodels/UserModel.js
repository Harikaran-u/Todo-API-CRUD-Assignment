const mongoose = require("mongoose");

const { Schema } = mongoose;

const users = new Schema(
  {
    username: {
      type: String,
      required: true,
      max: 25,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 25,
      min: 6,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", users);

module.exports = Users;
