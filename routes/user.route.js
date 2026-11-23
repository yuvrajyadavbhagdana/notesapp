const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../model/user.model");
const { JWT_SECRET } = require("../middlewere/jwt.secret");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({ msg: "Name, email, and password are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hash });
    await user.save();
    res.status(201).send("User Registered successfully");
  } catch (error) {
    if (error.code === 11000) return res.status(409).send({ msg: "Email is already registered" });
    res.status(500).send({ msg: "Could not register user" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ msg: "Email or password is incorrect" });
    }
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET);
    res.send({ msg: "Login Successfully", token });
  } catch (error) {
    res.status(500).send({ msg: "Could not sign in" });
  }
});

module.exports = { userRouter };
