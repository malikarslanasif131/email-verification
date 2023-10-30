require("dotenv").config();
const connection = require("./db");
const express = require("express");
const app = express();
const user = require("./routes/users");
(async () => await connection())();

app.use(express.json());
app.use("/api/user", user);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
