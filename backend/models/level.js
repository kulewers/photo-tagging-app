const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageResolutionSchema = new Schema({ width: Number, height: Number });

const LevelSchema = new Schema({
  imageResolution: { type: ImageResolutionSchema, required: true },
  imageUrl: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

module.exports = mongoose.model("level", LevelSchema);
