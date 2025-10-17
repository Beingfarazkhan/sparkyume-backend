const mongoose = require("mongoose");

const ideasSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Ideas = mongoose.model("ideas", ideasSchema);

module.exports = Ideas;
