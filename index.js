const express = require("express");
const app = express();
const helmet = require("helmet");
const users = require("./routes/users");
const auth = require("./routes/auth");
const posts = require("./routes/posts");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

app.use(helmet());
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/posts", posts);

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/socialAPI");
    console.log("connected to MongoDB...");
  } catch (error) {
    console.log("could not connected to MongoDB", error);
  }
}
main();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
