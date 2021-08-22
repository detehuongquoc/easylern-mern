const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VocabularySchema = new Schema({
  keyword: {
    type: String,
    required: true,
  },
  means: {
    type: String,
    required: true,
  },
  example: {
    type: String,
  },
  url: {
    type: String,
  },
  status: {
    type: Number,
    default: 0,
  },

  lernDay: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("vocabulary", VocabularySchema);
