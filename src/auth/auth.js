import express from "express";
import createError from "http-errors";
import userModel from "../apis/Users/model.js";

const authRouter = express.Router();

//REGISTER
authRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body);
    const users = await newUser.save();
    res.status(201).send(users);
  } catch (err) {
    next(err);
  }
});

//LOGIN
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkCredentials(email, password);
    if (user) {
      res.send(user);
    } else {
      next(createError(401, "Credentials are not valid!"));
    }
  } catch (err) {
    next(err);
  }
});

export default authRouter;
