const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();
  res.send("ok");
});
module.exports = router;
