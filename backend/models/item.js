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
});

module.exports = mongoose.model("item", ItemSchema);
