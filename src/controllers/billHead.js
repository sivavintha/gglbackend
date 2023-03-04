"use strict";
const winston = require("winston");
const _ = require("lodash");
const { BillHead } = require("../models/billHead");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateBillHead } = require("../validations/billHead");
const { Counter } = require("../models/counter");
let activityLog = {};

module.exports.createBillHead = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    let counter = await Counter.findOne({ type: "BILLHEAD" });
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
    req.body.code = code;

    // Validation
    const { error, value } = validateCreateBillHead(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the billHead
    winston.info(`Registering BillHead: ${req.body.name}`);

    const billHead = new BillHead(req.body);

    await billHead.save();

    if (billHead) {
      await Counter.findOneAndUpdate(
        { type: "BILLHEAD" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created BillHead successfully");

    return {
      status: true,
      data: billHead,
      message: "BillHead created successfully",
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

module.exports.getBillHeadByID = async function (id) {
  try {
    winston.info(`Getting information of billHead: ${id}`);

    const billHead = await BillHead.findById(id).populate("gstSlab");
    if (_.isEmpty(billHead)) {
      winston.debug("Invalid BillHead");
      return {
        status: false,
        data: null,
        message: "Invalid BillHead",
        errorCode: 200,
      };
    }

    return { status: true, data: billHead, message: "", errorCode: null };
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

module.exports.getAllBillHead = async function () {
  try {
    winston.info("Getting All BillHead");

    const billHead = await BillHead.find({ isDeleted: false }).populate(
      "gstSlab"
    );
    if (_.isEmpty(billHead)) {
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
      data: billHead,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBillHead = async function (req) {
  try {
    winston.info("Update BillHead");

    const billHead = await BillHead.findById(req.body._id);
    if (_.isEmpty(billHead)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (billHead.isDeleted) {
      return {
        status: false,
        data: null,
        message: "BillHead Already removed!",
        errorCode: 200,
      };
    }

    billHead.billHeadName = req.body.billHeadName;
    billHead.sac = req.body.sac;
    billHead.gstApplicable = req.body.gstApplicable;
    billHead.gstSlab = req.body.gstSlab ? req.body.gstSlab : null;

    billHead.updatedBy = req.user._id;
    let updatedBillHead = await new BillHead(billHead).save();
    updatedBillHead.populate("gstSlab");
    if (updatedBillHead) {
      activityLog.collectionName = "billHead";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_billHead";
      activityLog.doc = updatedBillHead;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBillHead,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteBillHead = async function (id, user) {
  try {
    winston.info("Update BillHead");

    const billHead = await BillHead.findById(id);
    if (_.isEmpty(billHead)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (billHead.isDeleted) {
      return {
        status: false,
        data: null,
        message: "BillHead Already removed!",
        errorCode: 200,
      };
    }

    billHead.isDeleted = true;

    billHead.deletedAt = Date.now();
    billHead.deletedBy = user._id;

    let deletedBillHead = await new BillHead(billHead).save();
    deletedBillHead.populate("gstSlab");
    if (deletedBillHead) {
      activityLog.collectionName = "billHead";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_billHead";
      activityLog.doc = deletedBillHead;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedBillHead,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
