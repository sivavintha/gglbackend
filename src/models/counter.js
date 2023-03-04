"use strict";
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  sequenceNumber: { type: Number, required: true },
  noOfDigits: { type: Number, required: true },
  prefix: { type: String, required: false },
  suffix: { type: String, required: false },
});

const Counter = mongoose.model("counters", counterSchema);

module.exports.Counter = Counter;
