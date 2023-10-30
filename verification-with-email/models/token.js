const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 2, // The document will be automatically deleted after 2 minutes of its creation time
  },
});

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
