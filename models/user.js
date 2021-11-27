const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxlength: 20,
      minlength: 3,
      unique: true,
    },
    email: {
      type: String,
      maxlength: 50,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      maxlength: 50,
    },
    city: {
      type: String,
      maxlength: 50,
    },
    from: {
      type: String,
      maxlength: 50,
    },
    relationship: {
      type: Number,
      enum: {
        values: [1, 2, 3],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.validate = validateUser;
