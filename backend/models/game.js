const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
  level: { type: Schema.Types.ObjectId, ref: "Level", required: true },
  startDate: { type: Date, required: true },
  itemsLeft: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  scoreSeconds: { type: Number },
  playerName: { type: String, default: "Anonymous" },
});

module.exports = mongoose.model("game", GameSchema);
