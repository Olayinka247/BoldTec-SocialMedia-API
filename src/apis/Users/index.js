import express from "express";
import userModel from "../../apis/Users/model.js";
import bcrypt from "bcrypt";

const userRouter = express.Router();

//UPDATE USER
userRouter.put("/:id", async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        next(error);
      }
    }
    try {
      const user = await userModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      next(error);
    }
  } else {
    res.status(403).json("You can update only your account!");
  }
});

//DELETE USER
userRouter.delete("/:id", async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await userModel.findByIdAndDelete(req.params.id);
      res.status(200).send("Account has been deleted Successfully !");
    } catch (error) {
      next(error);
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

//GET USER BY ID
userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    next(error);
  }
});

//FOLLOW USER
userRouter.put("/:id/follow", async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await userModel.findById(req.params.id);
      const currentUser = await userModel.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("Follow Successful");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});

//UNFOLLOW USER
userRouter.put("/:id/unfollow", async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await userModel.findById(req.params.id);
      const currentUser = await userModel.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("Unfollow Successful");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(403).json("you can't unfollow yourself");
  }
});

export default userRouter;
