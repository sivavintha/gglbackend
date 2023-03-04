"use strict";
const mongoose = require("mongoose");

const profitCenterSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    profitCenterName: { type: String, required: true },
    profitCenterShortName: { type: String, required: true },
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

profitCenterSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const ProfitCenter = mongoose.model("profitcenter", profitCenterSchema, "profitcenter");

exports.ProfitCenter = ProfitCenter;
