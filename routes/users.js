const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");

// Register
router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(8);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "username", "email"]));
});

//update User
router.patch("/me", auth, async (req, res) => {
  //need to set to 6 characters from frontend
  if (req.body.password) {
    const salt = await bcrypt.genSalt(8);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).send("user not found");
  res.send("user updated");
});

//delete user
router.delete("/me", auth, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  await User.findByIdAndDelete(req.user._id);
  res.send("Account has been deleted");
});
//get a user
//follow a user
//unfollow a user

module.exports = router;
