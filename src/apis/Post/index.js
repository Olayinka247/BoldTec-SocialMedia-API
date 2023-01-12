import express from "express";
import postModel from "../../apis/Post/model.js";
import userModel from "../../apis/Users/model.js";

const postRouter = express.Router();

//CREATE POST
postRouter.post("/", async (req, res, next) => {
  const newPost = new postModel(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
});

//UPDATE POST
postRouter.put("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You can only update your own post");
    }
  } catch (error) {
    next(error);
  }
});

//DELETE POST
postRouter.delete("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can only delete your own post");
    }
  } catch (error) {
    next(error);
  }
});

//LIKE / DISLIKE A POST

postRouter.put("/:id/like", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    next(error);
  }
});

//GET A POST
postRouter.get("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

//GET TIMELINE POSTS
postRouter.get("/timeline/all", async (req, res, next) => {
  try {
    const currentUser = await userModel.findById(req.body.userId);
    const userPosts = await postModel.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return postModel.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    next(error);
  }
});

export default postRouter;
