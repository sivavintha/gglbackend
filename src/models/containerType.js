"use strict";
const mongoose = require("mongoose");

const containerTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  abbr: { type: String, required: true },
});

const ContainerType = mongoose.model(
  "containertype",
  containerTypeSchema,
  "containertype"
);

module.exports.ContainerType = ContainerType;
