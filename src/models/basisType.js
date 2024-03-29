"use strict";
const mongoose = require("mongoose");

const basisTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbr: { type: String, required: true },
});

const BasisType = mongoose.model("basistype", basisTypeSchema, "basistype");

module.exports.BasisType = BasisType;
