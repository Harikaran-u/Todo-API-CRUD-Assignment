const mongoose = require("mongoose");

const { Schema } = mongoose;

const Todo = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "New Todo",
      min: 4,
      max: 24,
    },
    description: {
      type: String,
      required: true,
      default: "New Description",
      min: 20,
      max: 400,
    },
    userId: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Todos = mongoose.model("Todos", Todo);

module.exports = Todos;
