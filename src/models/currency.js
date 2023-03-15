"use strict";
const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbr: { type: String, required: true },
});

const Currency = mongoose.model("currency", currencySchema, "currency");

module.exports.Currency = Currency;
