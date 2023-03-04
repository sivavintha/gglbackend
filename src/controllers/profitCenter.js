"use strict";
const winston = require("winston");
const _ = require("lodash");
const { ProfitCenter } = require("../models/profitCenter");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateProfitCenter } = require("../validations/profitCenter");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.createProfitCenter = async function (req) {
  try {
    winston.debug("Transaction started");

    console.log("req ===>", req.body);
    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    // Validation
    const { error, value } = validateCreateProfitCenter(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    let counter = await Counter.findOne({ type: "PC" });
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

    // Now registering the profitCenter
    winston.info(`Registering ProfitCenter: ${req.body.name}`);

    const profitCenter = new ProfitCenter(req.body);

    await profitCenter.save();

    if (profitCenter) {
      await Counter.findOneAndUpdate(
        { type: "PC" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created ProfitCenter successfully");

    return {
      status: true,
      data: profitCenter,
      message: "ProfitCenter created successfully",
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

module.exports.getProfitCenterByID = async function (id) {
  try {
    winston.info(`Getting information of profitCenter: ${id}`);

    const profitCenter = await ProfitCenter.findById(id);
    if (_.isEmpty(profitCenter)) {
      winston.debug("Invalid ProfitCenter");
      return {
        status: false,
        data: null,
        message: "Invalid ProfitCenter",
        errorCode: 200,
      };
    }

    return { status: true, data: profitCenter, message: "", errorCode: null };
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

module.exports.getAllProfitCenter = async function () {
  try {
    winston.info("Getting All ProfitCenter");

    const profitCenter = await ProfitCenter.find({ isDeleted: false });
    if (_.isEmpty(profitCenter)) {
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
      data: profitCenter,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateProfitCenter = async function (req) {
  try {
    winston.info("Update ProfitCenter");

    const profitCenter = await ProfitCenter.findById(req.body._id);
    if (_.isEmpty(profitCenter)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (profitCenter.isDeleted) {
      return {
        status: false,
        data: null,
        message: "ProfitCenter Already removed!",
        errorCode: 200,
      };
    }

    profitCenter.profitCenterName = req.body.profitCenterName;
    profitCenter.profitCenterShortName = req.body.profitCenterShortName;

    profitCenter.updatedBy = req.user._id;
    let updatedProfitCenter = await new ProfitCenter(profitCenter).save();
    if (updatedProfitCenter) {
      activityLog.collectionName = "profitCenter";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_profitCenter";
      activityLog.doc = updatedProfitCenter;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedProfitCenter,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteProfitCenter = async function (id, user) {
  try {
    winston.info("Update ProfitCenter");

    const profitCenter = await ProfitCenter.findById(id);
    if (_.isEmpty(profitCenter)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (profitCenter.isDeleted) {
      return {
        status: false,
        data: null,
        message: "ProfitCenter Already removed!",
        errorCode: 200,
      };
    }

    profitCenter.isDeleted = true;

    profitCenter.deletedAt = Date.now();
    profitCenter.deletedBy = user._id;

    let deletedProfitCenter = await new ProfitCenter(profitCenter).save();
    if (deletedProfitCenter) {
      activityLog.collectionName = "profitCenter";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_profitCenter";
      activityLog.doc = deletedProfitCenter;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedProfitCenter,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
