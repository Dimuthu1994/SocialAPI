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
//delete a post
//like a post
// get a post
// get timeline posts

module.exports = router;
