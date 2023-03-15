"use strict";
const mongoose = require("mongoose");
require("./billHead");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    fyear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fyear",
      required: true,
    },
    pc_code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profitcenter",
      required: true,
    },

    invoiceCategory: { type: String, required: true },
    billingTo: { type: String, required: true },

    bookingNo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },
    billingParty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: true,
    },

    invoiceDate: { type: Date, required: true },
    isFinalled: { type: Boolean, required: true },
    finalledAt: { type: Boolean, required: false, default: false },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    isCancelled: { type: Boolean, required: false, default: false },
    cancelledAt: { type: Date, required: false },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    createdBy: {
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

invoiceSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const Invoice = mongoose.model("invoice", invoiceSchema, "invoice");

exports.Invoice = Invoice;
