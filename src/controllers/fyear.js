"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Fyear } = require("../models/fyear");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateFyear } = require("../validations/fyear");
let activityLog = {};

module.exports.createFyear = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    // Validation
    const { error, value } = validateCreateFyear(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the fyear
    winston.info(`Registering Fyear: ${req.body.name}`);

    const fyear = new Fyear(req.body);

    await fyear.save();

    winston.info("Created Fyear successfully");

    return {
      status: true,
      data: fyear,
      message: "Fyear created successfully",
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

module.exports.getFyearByID = async function (id) {
  try {
    winston.info(`Getting information of fyear: ${id}`);

    const fyear = await Fyear.findById(id);
    if (_.isEmpty(fyear)) {
      winston.debug("Invalid Fyear");
      return {
        status: false,
        data: null,
        message: "Invalid Fyear",
        errorCode: 200,
      };
    }

    return { status: true, data: fyear, message: "", errorCode: null };
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

module.exports.getAllFyear = async function () {
  try {
    winston.info("Getting All Fyear");

    const fyear = await Fyear.find({ isDeleted: false });
    if (_.isEmpty(fyear)) {
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
      data: fyear,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateFyear = async function (req) {
  try {
    winston.info("Update Fyear");

    const fyear = await Fyear.findById(req.body._id);
    if (_.isEmpty(fyear)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (fyear.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Fyear Already removed!",
        errorCode: 200,
      };
    }

    fyear.prefix = req.body.prefix;
    fyear.suffix = req.body.suffix;
    fyear.fullYear = req.body.fullYear;
    fyear.startDt = req.body.startDt;
    fyear.endDt = req.body.endDt;

    fyear.updatedBy = req.user._id;
    let updatedFyear = await new Fyear(fyear).save();
    if (updatedFyear) {
      activityLog.collectionName = "fyear";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_fyear";
      activityLog.doc = updatedFyear;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedFyear,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteFyear = async function (id, user) {
  try {
    winston.info("Update Fyear");

    const fyear = await Fyear.findById(id);
    if (_.isEmpty(fyear)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (fyear.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Fyear Already removed!",
        errorCode: 200,
      };
    }

    fyear.isDeleted = true;

    fyear.deletedAt = Date.now();
    fyear.deletedBy = user._id;

    let deletedFyear = await new Fyear(fyear).save();
    if (deletedFyear) {
      activityLog.collectionName = "fyear";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_fyear";
      activityLog.doc = deletedFyear;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedFyear,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
