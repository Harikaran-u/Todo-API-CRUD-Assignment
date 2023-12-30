const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const port = 3000;

dotenv.config();

async function connectTodoDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log(error);
  }
}

connectTodoDb();

app.listen(port, () =>
  console.log(`Application is started and listening to port: ${port}`)
);
