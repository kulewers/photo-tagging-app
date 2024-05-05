const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
  level: { type: Schema.Types.ObjectId, ref: "level", required: true },
  startDate: { type: Date, required: true },
  itemsLeft: [{ type: Schema.Types.ObjectId, ref: "item" }],
  scoreMilliseconds: { type: Number },
  playerName: { type: String, default: "Anonymous" },
});

module.exports = mongoose.model("game", GameSchema);
