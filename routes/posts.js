const { Post, validate } = require("../models/post");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//create a post
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = new Post(req.body);
  await post.save();
  res.send("saved to database");
});
//update a post
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("The post with given id not found");

  if (post.userId === req.body.userId) {
    await post.updateOne({ $set: req.body });
    res.send("the post has updated");
  } else {
    res.status(403).send("you can update only your post");
  }
});
//delete a post
router.delete("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("The post with given id not found");

  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.send("the post has deleted");
  } else {
    res.status(403).send("you can delete only your post");
  }
});
//like a post
router.put("/:id/like", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("The post with given id not found");

  if (!post.likes.includes(req.body.userId)) {
    await post.updateOne({ $push: { likes: req.body.userId } });
    res.send("post liked");
  } else {
    await post.updateOne({ $pull: { likes: req.body.userId } });
    res.send("post disliked");
  }
});
// get a post
router.get("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post)
    return res.status(404).send("The post with the given ID is not found");
  res.send(post);
});
// get timeline posts
router.get("/timeline/all", auth, async (req, res) => {
  const currentUser = await User.findById(req.body.userId);
  //if (!post) return res.status(404).send("The post with given id not found");
  const userPosts = await Post.find({ userId: currentUser._id });
  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId });
    })
  );
  res.send(userPosts.concat(...friendPosts));
});
module.exports = router;
