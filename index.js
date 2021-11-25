const express = require("express");
const app = express();
const helmet = require("helmet");

app.use(helmet());
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
