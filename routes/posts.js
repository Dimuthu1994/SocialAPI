const { Post, validate } = require("../models/post");
const express = require("express");
const router = express.Router();

//create a post
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const post = new Post(req.body);
  await post.save();
  res.send("saved to database");
});
//update a post
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
// get a post
// get timeline posts

module.exports = router;
