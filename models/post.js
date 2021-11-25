const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
      default: "",
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    desc: Joi.string().max(500),
    img: Joi.string(),
    likes: Joi.array(),
  });
  return schema.validate(post);
}
module.exports.Post = Post;
module.exports.validate = validatePost;
