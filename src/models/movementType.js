"use strict";
const mongoose = require("mongoose");

const movementTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  abbr: { type: String, required: true },
});

const MovementType = mongoose.model(
  "movementtype",
  movementTypeSchema,
  "movementtype"
);

module.exports.MovementType = MovementType;
