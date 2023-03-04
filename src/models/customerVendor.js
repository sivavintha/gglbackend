"use strict";
const mongoose = require("mongoose");

const customerVendorSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    address1: { type: String, required: false, default: "" },
    address2: { type: String, required: false, default: "" },
    city: { type: String, required: false, default: "" },
    state: { type: String, required: false, default: "" },
    stateTin: { type: String, required: false, default: "" },
    country: { type: String, required: false, default: "India" },
    zipcode: { type: String, required: false, default: "" },
    emailId: { type: String, required: false }, //unique: true
    geoCode: { type: String, required: false, default: "91" },
    mobileNumber: { type: String, required: false }, //unique: true
    profitCenter: { type: String, required: true },

    gstInNumber: { type: String, required: false },

    isShipper: { type: Boolean, required: false, default: false },
    isConsignee: { type: Boolean, required: false, default: false },
    isNotifier: { type: Boolean, required: false, default: false },
    isOverseasAgent: { type: Boolean, required: false, default: false },
    isCHA: { type: Boolean, required: false, default: false },
    isLine: { type: Boolean, required: false, default: false },
    isTransporter: { type: Boolean, required: false, default: false },
    isSupplier: { type: Boolean, required: false, default: false },
    isDeliveryAgent: { type: Boolean, required: false, default: false },
    isWarehouse: { type: Boolean, required: false, default: false },

    creditDays: { type: Number, required: false, default: 0 },

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

customerVendorSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const CustomerVendor = mongoose.model(
  "customervendor",
  customerVendorSchema,
  "customervendor"
);

exports.CustomerVendor = CustomerVendor;
