const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    role: {
      type: String,
      enum: ["admin", "usuario", "premium"],
      default: "usuario",
    },
    resetToken: {
      token: String,
      expire: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("user", schema);
