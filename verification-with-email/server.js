require("dotenv").config();
const connection = require("./db");
const express = require("express");
const app = express();

(async () => await connection())();

app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
