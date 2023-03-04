"use strict";
const mongoose = require("mongoose");

const fyearSchema = new mongoose.Schema(
  {
    prefix: { type: String, required: true },
    suffix: { type: String, required: true },
    fullYear: { type: String, required: true },
    startDt: { type: Date, required: true },
    endDt: { type: Date, required: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    isDeleted: { type: Boolean, required: false, default: false },
    deletedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

fyearSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const Fyear = mongoose.model("fyear", fyearSchema, "fyear");

exports.Fyear = Fyear;
