const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemDimensionsSchema = new Schema({
  left: Number,
  top: Number,
  width: Number,
  height: Number,
});

const ItemSchema = new Schema({
  name: String,
  imageUrl: String,
  dimensions: { type: ItemDimensionsSchema, required: true },
  level: { type: Schema.Types.ObjectId, ref: "level" },
});

module.exports = mongoose.model("item", ItemSchema);
