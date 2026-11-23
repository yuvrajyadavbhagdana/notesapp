const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const noteModel = mongoose.model("note", noteSchema);

module.exports = { noteModel };
