const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const app = express();
const port = 3000;
const secretTokenKey = "MY_SECRET_TOKEN";

dotenv.config();

const User = require("./dbmodels/UserModel");
const Todo = require("./dbmodels/TodoModel");

async function connectTodoDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.log(error);
  }
}

connectTodoDb();

//json parser

app.use(express.json());

//Authentication Middleware

const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.body.headers["authorization"];
  // console.log(authHeader);
  if (authHeader) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken !== undefined) {
    JWT.verify(jwtToken, secretTokenKey, async (error, payload) => {
      if (error) {
        res.status(401);
        res.json({ message: "Invalid JWT Token" });
      } else {
        next();
      }
    });
  } else {
    res.status(401);
    res.json({ message: "Invalid JWT Token" });
  }
};

const validateTodoItem = (title, description) => {
  const titleLength = title.length;
  const descriptionLength = description.length;

  const validateTitleDescription =
    title !== "" ||
    title !== undefined ||
    description !== "" ||
    description !== undefined;

  const validateTodoLength =
    titleLength >= 3 &&
    titleLength <= 24 &&
    descriptionLength >= 20 &&
    descriptionLength <= 200;

  if (validateTitleDescription && validateTodoLength) {
    return true;
  }
  return false;
};

//create new user end point

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const minChar = 6;
  const maxChar = 25;
  const usernameLength = username.length;
  const userPwdLength = password.length;

  const validateCredentials =
    username === "" ||
    username === undefined ||
    password === "" ||
    password === undefined;

  const userNameLengthValidation =
    usernameLength < minChar || usernameLength > maxChar;

  const passwordLengthValidation =
    userPwdLength > maxChar || userPwdLength < minChar;

  if (validateCredentials) {
    res.status(400);
    res.json({ message: "Please kindly give valid username & password" });
  } else if (userNameLengthValidation) {
    res.status(400);
    res.json({
      message: `username should contain minimum ${minChar} and maximum ${maxChar} characters`,
    });
  } else {
    const response = await User.findOne({ username });
    if (response) {
      res.status(409);
      res.json({ message: "User already exists" });
    } else {
      if (passwordLengthValidation) {
        res.status(400);
        res.json({
          message: `Password should contain minimum ${minChar} and maximum ${maxChar} characters`,
        });
      } else {
        const hashedPwd = await bcrypt.hash(password, 15);
        try {
          const user = new User({ username, password: hashedPwd });
          await user.save();

          res.status(200);
          res.json({
            message: "Successfully registerd.Please kindly Login",
          });
        } catch (err) {
          res.status(500);
          res.json({ message: "Internal Server Error", error: err });
        }
      }
    }
  }
});

//login user end point

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const validUser = await User.findOne({ username });

    if (validUser) {
      const userPwd = validUser.password;
      const userId = validUser._id;
      const isValidPassword = await bcrypt.compare(password, userPwd);

      if (isValidPassword) {
        const payload = JSON.stringify({ username: username });
        const jwtToken = JWT.sign(payload, secretTokenKey);
        res.status(200);
        res.json({
          message: "Login successful",
          AuthToken: jwtToken,
          userId: userId,
        });
      } else {
        res.status(401);
        res.json({ message: "Invalid password.Please provide valid password" });
      }
    } else {
      res.status(401);
      res.json({
        message: "Invalid user.Please provide valid user credentials.",
      });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "Internal server error", err: error });
  }
});

//create new todo

app.post("/newtodo", authenticateToken, async (req, res) => {
  const userId = req.body.userId;
  const { title, description } = req.body;

  if (validateTodoItem(title, description)) {
    const newTodo = new Todo({ title, description, userId });
    const todoId = newTodo._id;
    // console.log(todoId);
    res.status(200).json({ message: "Todo created successfully", todoId });
    await newTodo.save();
  } else {
    res.status(400).json({
      message:
        "Please give valid title & description.Once check valid title & description length",
    });
  }
});

//get todos

app.get("/alltodos", authenticateToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    const todoData = await Todo.find({ userId: userId });
    if (todoData.length > 0) {
      res.status(200).json({ data: todoData });
    } else {
      res.status(404).json({ message: "user todo data not available" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

//update todo

app.put("/update/:id", authenticateToken, async (req, res) => {
  const todoId = req.params.id;
  // console.log(todoId);
  const { title, description } = req.body;
  try {
    if (validateTodoItem(title, description)) {
      const todoItem = await Todo.findById(todoId);
      await todoItem.updateOne({ title, description });
      res.status(200).json({ message: "Todo updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

//delete todo

app.delete("/delete/:id", authenticateToken, async (req, res) => {
  const todoId = req.params.id;
  try {
    await Todo.findByIdAndDelete(todoId);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//server listening
app.listen(port, () =>
  console.log(`Application is started and listening to port: ${port}`)
);
