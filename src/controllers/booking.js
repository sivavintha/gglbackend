"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Booking } = require("../models/booking");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateBooking } = require("../validations/booking");
const { Counter } = require("../models/counter");
require("../models/billHead");

let activityLog = {};

module.exports.createBooking = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;
    // req.body.containers = [];
    // req.body.buyRate=[];
    // req.body.sellRate=[];
    // req.body.vesselSchedule=[];
    // req.body.events=[];

    let counter = await Counter.findOne({ type: "BOOKING" });
    if (!counter) {
      return {
        status: false,
        data: null,
        message: "Counter not found!",
        errorCode: 400,
      };
    }
    const code =
      counter.prefix +
      (+counter.sequenceNumber + 1).toString().padStart(counter.noOfDigits, 0) +
      counter.suffix;
    req.body.bookingNo = code;

    // Validation
    const { error, value } = validateCreateBooking(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the booking
    winston.info(`Registering Booking: ${req.body.name}`);

    const booking = new Booking(req.body);

    await booking.save();

    if (booking) {
      await Counter.findOneAndUpdate(
        { type: "BOOKING" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created Booking successfully");

    return {
      status: true,
      data: booking,
      message: "Booking created successfully",
      errorCode: null,
    };
  } catch (error) {
    winston.debug("Transaction failed");

    if (error.code === 11000) {
      return {
        status: false,
        data: null,
        message: "Already exists: " + JSON.stringify(error.keyValue),
        errorCode: 200,
      };
    }
    if (error.status && error.errorCode) {
      return error;
    }
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.getBookingByID = async function (id) {
  try {
    winston.info(`Getting information of booking: ${id}`);

    const booking = await Booking.findById(id)
      .populate("shipper")
      .populate("consignee")
      .populate("notifier")
      .populate("overseasAgent")
      .populate("deliveryAgent")
      .populate("line")
      .populate("transporter")
      .populate("CHA")
      .populate("commodity")
      .populate("pol")
      .populate("pod")
      .populate("sellRate.narration")
      .populate("sellRate.billingTo")
      .populate("buyRate.narration")
      .populate("buyRate.billingTo");
    if (_.isEmpty(booking)) {
      winston.debug("Invalid Booking");
      return {
        status: false,
        data: null,
        message: "Invalid Booking",
        errorCode: 200,
      };
    }

    return { status: true, data: booking, message: "", errorCode: null };
  } catch (error) {
    if (error.name === "CastError") {
      winston.debug("Invalid  ID");
      return {
        status: false,
        data: null,
        message: "Invalid  ID",
        errorCode: 200,
      };
    }
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.getAllBooking = async function () {
  try {
    winston.info("Getting All Booking");

    const booking = await Booking.find({ isDeleted: false })
      .populate("shipper")
      .populate("consignee")
      .populate("notifier")
      .populate("overseasAgent")
      .populate("deliveryAgent")
      .populate("line")
      .populate("transporter")
      .populate("CHA")
      .populate("commodity")
      .populate("pol")
      .populate("pod")
      .populate("sellRate.narration")
      .populate("sellRate.billingTo")
      .populate("buyRate.narration")
      .populate("buyRate.billingTo");
    if (_.isEmpty(booking)) {
      winston.debug();
      return {
        status: false,
        data: [],
        message: "No data found",
        errorCode: 200,
      };
    }

    return {
      status: true,
      data: booking,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBookingGeneralDetails = async function (req) {
  try {
    winston.info("Update Booking");

    const booking = await Booking.findById(req.body._id);
    if (_.isEmpty(booking)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (booking.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Booking Already removed!",
        errorCode: 200,
      };
    }

    booking.freight = req.body.freight;
    booking.operation = req.body.operation;
    booking.shipmentType = req.body.shipmentType;
    booking.pol = req.body.pol;
    booking.pod = req.body.pod;
    booking.finalDestination = req.body.finalDestination;
    booking.blNo = req.body.blNo;
    booking.blType = req.body.blType;
    booking.mblTerms = req.body.mblTerms;
    booking.hblTerms = req.body.hblTerms;
    booking.commodity = req.body.commodity;
    booking.vessel = req.body.vessel;
    booking.voyage = req.body.voyage;
    booking.noOfPackages = req.body.noOfPackages;
    booking.grossWt = req.body.grossWt;
    booking.netWt = req.body.netWt;
    booking.cbm = req.body.cbm;
    booking.description = req.body.description;
    booking.remarks = req.body.remarks;
    // booking.containers = req.body.containers;

    booking.shipper = req.body.shipper;
    booking.consignee = req.body.consignee;
    booking.notifier = req.body.notifier;
    booking.line = req.body.line;
    booking.overseasAgent = req.body.overseasAgent;
    booking.deliveryAgent = req.body.deliveryAgent;
    booking.transporter = req.body.transporter;
    booking.CHA = req.body.CHA;

    booking.ourRefNo = req.body.ourRefNo;
    booking.exrate = req.body.exrate;

    booking.updatedBy = req.user._id;
    let updatedBooking = await new Booking(booking).save();
    if (updatedBooking) {
      activityLog.collectionName = "booking";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_booking_general_details";
      activityLog.doc = updatedBooking;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBooking,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBookingVesselSchedule = async function (req) {
  try {
    winston.info("Update Booking");

    const booking = await Booking.findById(req.body._id);
    if (_.isEmpty(booking)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (booking.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Booking Already removed!",
        errorCode: 200,
      };
    }

    booking.vesselSchedule = req.body.vesselSchedule;

    booking.updatedBy = req.user._id;
    let updatedBooking = await new Booking(booking).save();
    if (updatedBooking) {
      activityLog.collectionName = "booking";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_booking_schedule";
      activityLog.doc = updatedBooking;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBooking,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBookingRates = async function (req) {
  try {
    winston.info("Update Booking");

    const booking = await Booking.findById(req.body._id);
    if (_.isEmpty(booking)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (booking.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Booking Already removed!",
        errorCode: 200,
      };
    }
    if (req.body.sellRate) {
      booking.sellRate = req.body.sellRate;
    }

    if (req.body.buyRate) {
      booking.buyRate = req.body.buyRate;
    }

    booking.updatedBy = req.user._id;
    let updatedBooking = await new Booking(booking).save();
    if (updatedBooking) {
      activityLog.collectionName = "booking";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_booking_rates";
      activityLog.doc = updatedBooking;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBooking,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBookingContainer = async function (req) {
  try {
    winston.info("Update Booking");

    const booking = await Booking.findById(req.body._id);
    if (_.isEmpty(booking)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (booking.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Booking Already removed!",
        errorCode: 200,
      };
    }

    booking.containers = req.body.containers;

    booking.updatedBy = req.user._id;
    let updatedBooking = await new Booking(booking).save();
    if (updatedBooking) {
      activityLog.collectionName = "booking";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_booking_containers";
      activityLog.doc = updatedBooking;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBooking,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBookingEvents = async function (req) {
  try {
    winston.info("Update Booking");

    const booking = await Booking.findById(req.body._id);
    if (_.isEmpty(booking)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (booking.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Booking Already removed!",
        errorCode: 200,
      };
    }

    booking.events = req.body.events;

    booking.updatedBy = req.user._id;
    let updatedBooking = await new Booking(booking).save();
    if (updatedBooking) {
      activityLog.collectionName = "booking";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_booking_events";
      activityLog.doc = updatedBooking;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBooking,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteBooking = async function (id, user) {
  try {
    winston.info("Update Booking");

    const booking = await Booking.findById(id);
    if (_.isEmpty(booking)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (booking.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Booking Already removed!",
        errorCode: 200,
      };
    }

    booking.isDeleted = true;

    booking.deletedAt = Date.now();
    booking.deletedBy = user._id;

    let deletedBooking = await new Booking(booking).save();
    if (deletedBooking) {
      activityLog.collectionName = "booking";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_booking";
      activityLog.doc = deletedBooking;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedBooking,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
