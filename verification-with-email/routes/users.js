const sendEmail = require("../utils/email");
const Token = require("../models/token");
const { User } = require("../models/user");
const crypto = require("crypto");

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("User with given email already exist!");

    user = await new User({
      name: req.body.name,
      email: req.body.email,
    }).save();
    console.log("user", user);
    let token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    console.log("token", token);
    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    console.log("message", message);
    // const textMessage = `Please verify your email by clicking on the following link: ${message}`;

    const htmlMessage = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f2f2f2;
        font-family: Arial, sans-serif;
        text-align: center;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 20px;
        margin: 0 auto;
        width: 80%;
        max-width: 400px;
      }
      h1 {
        color: #333;
      }
      .button {
        background-color: #3db4e6;
        border: none;
        color: white !important;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 20px;
        border-radius: 4px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking the button below:</p>
      <a class="button" href="${message}">Click to Verify</a>
        <p>This link will expire in 2 minutes.</p>
    </div>
  </body>
</html>
`;

    await sendEmail(user.email, "Verify Email", htmlMessage);
    // await sendEmail(user.email, "Verify Email", textMessage, htmlMessage);

    res.send("An Email sent to your account please verify");
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

module.exports = router;
