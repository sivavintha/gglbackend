"use strict";
const mongoose = require("mongoose");

const billHeadSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    billHeadName: { type: String, required: true },
    sac: { type: String, required: false },
    gstApplicable: { type: Boolean, required: false },
    gstSlab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gst",
      required: false,
    },
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

billHeadSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const BillHead = mongoose.model("billheads", billHeadSchema, "billheads");

exports.BillHead = BillHead;
