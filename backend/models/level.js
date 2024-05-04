const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageResolutionSchema = new Schema({ width: Number, height: Number });

const LevelSchema = new Schema({
  imageResolution: { type: ImageResolutionSchema, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("level", LevelSchema);
