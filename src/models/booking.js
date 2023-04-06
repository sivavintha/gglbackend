"use strict";
const { number } = require("joi");
const mongoose = require("mongoose");
require("./billHead");

const bookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, required: true },
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
    ourRefNo: { type: String, required: false },
    exrate: { type: String, required: false },
    freight: { type: String, required: true },
    operation: { type: String, required: true },
    shipmentType: { type: String, required: true },
    pol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seaports",
      required: true,
    },
    pod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seaports",
      required: true,
    },
    finalDestination: { type: String, required: false },
    blNo: { type: String, required: false },
    blType: { type: String, required: false, default: "Direct" },
    mblTerms: { type: String, required: false },
    hblTerms: { type: String, required: false },
    commodity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "commodity",
      required: true,
    },
    vessel: { type: String, required: false },
    voyage: { type: String, required: false },
    noOfPackages: { type: Number, required: false, default: 0 },
    grossWt: { type: Number, required: false, default: 0.0 },
    netWt: { type: Number, required: false, default: 0.0 },
    cbm: { type: Number, required: false, default: 0.0 },
    description: { type: String, required: false },
    remarks: { type: String, required: false },
    containers: [
      {
        containerNo: { type: String, required: false },
        containerType: { type: String, required: false },
        sealNo: { type: String, required: false },
        noOfPackages: { type: Number, required: false },
        grossWt: { type: Number, required: false, default: 0.0 },
        netWt: { type: Number, required: false, default: 0.0 },
        cbm: { type: Number, required: false, default: 0.0 },
      },
    ],
    vesselSchedule: [
      {
        legNo: { type: Number, required: false },
        vesselType: { type: String, required: false },
        vesselName: { type: String, required: false },
        voyage: { type: String, required: false },
        portFrom: { type: String, required: false },
        portTo: { type: String, required: false },

        ETD: { type: Date, required: false },
        ETA: { type: Date, required: false },
        sailedDt: { type: Date, required: false },
        arrivedDt: { type: Date, required: false },
      },
    ],
    sellRate: [
      {
        narration: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "billheads",
          required: true,
        },
        description: { type: String, required: false },
        billingTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customervendor",
          required: true,
        },
        isSupplementary: { type: String, required: false },
        basis: { type: String, required: false },
        qty: { type: Number, required: false },
        currency: { type: String, required: false },
        unitRate: { type: Number, required: false },
        exrate: { type: Number, required: false, default: 1.0 },
        amount: { type: Number, required: false },
        isFinalled: { type: Boolean, required: false, default: false },
      },
    ],
    buyRate: [
      {
        narration: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "billheads",
          required: true,
        },
        description: { type: String, required: false },
        billingTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customervendor",
          required: true,
        },
        isSupplementary: { type: String, required: false },
        basis: { type: String, required: false },
        qty: { type: Number, required: false },
        currency: { type: String, required: false },
        unitRate: { type: Number, required: false },
        exrate: { type: Number, required: false, default: 1.0 },
        amount: { type: Number, required: false },
        isFinalled: { type: Boolean, required: false, default: false },
      },
    ],
    events: {
      productionPlannedDt: { type: Date, required: false },
      productionActualDt: { type: Date, required: false },
      containerBookingPlannedDt: { type: Date, required: false },
      containerBookingActualDt: { type: Date, required: false },
      doReleasePlannedDt: { type: Date, required: false },
      doReleaseActualDt: { type: Date, required: false },
      containerCollectionPlannedDt: { type: Date, required: false },
      containerCollectionActualDt: { type: Date, required: false },
      containerStuffingPlannedDt: { type: Date, required: false },
      containerStuffingActualDt: { type: Date, required: false },
      containerDispatchPlannedDt: { type: Date, required: false },
      containerDispatchActualDt: { type: Date, required: false },
      containerArrivalPlannedDt: { type: Date, required: false },
      containerArrivalActualDt: { type: Date, required: false },
      containerLoadingPlannedDt: { type: Date, required: false },
      containerLoadingActualDt: { type: Date, required: false },
      originETDPlannedDt: { type: Date, required: false },
      originETDActualDt: { type: Date, required: false },
      port1ArrivalPlannedDT: { type: Date, required: false },
      port1ArrivalActualDT: { type: Date, required: false },
      port1DeparturePlannedDt: { type: Date, required: false },
      Port1DepartureActualDT: { type: Date, required: false },
      port2ArrivalPlannedDT: { type: Date, required: false },
      port2ArrivalActualDT: { type: Date, required: false },
      port2DeparturePlannedDt: { type: Date, required: false },
      Port2DepartureActualDT: { type: Date, required: false },
      port3ArrivalPlannedDT: { type: Date, required: false },
      port3ArrivalActualDT: { type: Date, required: false },
      port3DeparturePlannedDt: { type: Date, required: false },
      Port3DepartureActualDT: { type: Date, required: false },
      destinationETAPlannedDt: { type: Date, required: false },
      destinationETAActualDt: { type: Date, required: false },
      containerUnloadingPlannedDT: { type: Date, required: false },
      containerUnloadingActualDt: { type: Date, required: false },
      containerScanPlnnedDt: { type: Date, required: false },
      containerScanActualDt: { type: Date, required: false },
      containerRelasePlannedDt: { type: Date, required: false },
      containerRelaseActualDt: { type: Date, required: false },
      containerPickupPlannedDt: { type: Date, required: false },
      containerPickupActualDt: { type: Date, required: false },
      containerDeliveryPlannedDt: { type: Date, required: false },
      containerDeliveryActualDt: { type: Date, required: false },
      containerReturnPlannedDt: { type: Date, required: false },
      containerReturnActualDt: { type: Date, required: false },
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: true,
    },
    consignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: true,
    },
    notifier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: false,
    },
    line: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: false,
    },
    overseasAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: false,
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: false,
    },
    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: false,
    },
    CHA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customervendor",
      required: false,
    },

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

bookingSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const Booking = mongoose.model("booking", bookingSchema, "booking");

exports.Booking = Booking;
