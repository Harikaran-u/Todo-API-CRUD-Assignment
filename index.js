const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const app = express();
const port = 3000;
const secretToken = "MY_SECRET_TOKEN";

dotenv.config();

const User = require("./dbmodels/UserModel");

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
          const payload = { username: username };
          const jwtToken = JWT.sign(payload, secretToken);
          res.status(200);
          res.json({
            message: "Successfully registerd.Please kindly Login",
            AuthToken: jwtToken,
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
});

app.listen(port, () =>
  console.log(`Application is started and listening to port: ${port}`)
);
