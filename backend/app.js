// TODO: jwt support for verifying gameId

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// DB setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

const Level = require("./models/level");
const Game = require("./models/game");
const { body, validationResult } = require("express-validator");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.set({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  next();
});

app.post("/cleanup", async (req, res) => {
  const deleteCount = await Game.deleteMany({
    scoreSeconds: null,
    startDate: { $lte: Math.floor(new Date().getTime() / 1000) + 60 * 60 },
  });
  res.json(deleteCount);
});

app.post("/start-game", [
  body("levelId").isMongoId().escape(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const level = await Level.findById(req.body.levelId).populate("items");

    if (!level) {
      res.status(404).json({ errors: [{ msg: "Level not found" }] });
      return;
    }

    const items = level.items;

    const game = new Game({
      level: req.body.levelId,
      startDate: new Date(),
      itemsLeft: items.map((item) => item._id),
    });

    await game.save();

    res.json({
      // gameId will be replaced by gameToken when using jwt
      gameId: game._id,
      levelData: {
        imageUrl: level.imageUrl,
        items: items.map((item) => {
          return { name: item.name, imageUrl: item.imageUrl };
        }),
      },
    });
  },
]);

app.post("/validate", [
  body("gameId").exists().escape(),
  body("itemName").isLength({ min: 1 }).escape(),
  body("normalizedCoordinates").isObject().escape(),
  async (req, res) => {
    // res.json({ match: true });
    // return;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
      return;
    }

    const game = await Game.findById(req.params.gameId).populate(
      "level itemsLeft"
    );
    const level = game.level;

    const requestedItem = game.itemsLeft.filter(
      (item) => item.name === req.body.itemName
    )[0];

    if (!requrestedItem) {
      res.status(400).json({ errors: [{ msg: "Item not in the list" }] });
      return;
    }

    const itemDimensions = requestedItem.dimensions;

    const { top, left } = req.body.normalizedCoordinates;
    if (top === undefined || left === undefined) {
      res.status(400).json({ errors: [{ msg: "Coordinates not provided" }] });
    }

    const x = left * level.imageResolution.width;
    const y = top * level.imageResolution.height;

    const leeway = 20;
    let match;
    if (
      x >= itemDimensions.left - leeway &&
      x <= itemDimensions.left + itemDimensions.width + leeway &&
      y > itemDimensions.top - leeway &&
      y < itemDimensions.top + itemDimensions.height + leeway
    ) {
      match = true;
    } else {
      match = false;
    }

    let gameEnd = false;

    if (match) {
      game.itemsLeft = game.itemsLeft
        .filter((item) => item.name !== req.body.itemName)
        .map((item) => item._id);

      if (game.itemsLeft.length === 0) {
        game.scoreSeconds = Math.floor(new Date() / 1000) - game.startDate;
        gameEnd = true;
      }

      await game.save();
    }
    res.json({ match, gameEnd, score: game.scoreSeconds });
  },
]);

app.post("/submit-name", [
  body("gameId").exists().escape(),
  body("playerName").trim().escape(),
  async (req, res) => {
    const game = Game.findById(req.body.gameId);

    game.playerName = req.body.playerName;
    await game.save();

    res.json({ playerName: req.body.playerName });
  },
]);

module.exports = app;
