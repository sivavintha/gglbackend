"use strict";
const mongoose = require("mongoose");

const gstSchema = new mongoose.Schema(
  {
    gst: { type: Number, required: true },
    cgst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    igst: {
      type: Number,
      required: true,
    },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date, required: false },
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

gstSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const GST = mongoose.model("gst", gstSchema, "gst");

exports.GST = GST;
