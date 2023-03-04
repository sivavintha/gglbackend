"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Counter } = require("../models/counter");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateCounter } = require("../validations/counter");
let activityLog = {};

module.exports.createCounter = async function (req) {
  try {
    winston.debug("Transaction started");

    // req.body.createdBy = req.user._id;
    // req.body.isDeleted = false;
    // req.body.deletedAt = null;
    // req.body.deletedBy = null;
    // req.body.updatedBy = null;

    // Validation
    const { error, value } = validateCreateCounter(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the counter
    winston.info(`Registering Counter: ${req.body.name}`);

    const counter = new Counter(req.body);

    await counter.save();

    winston.info("Created Counter successfully");

    return {
      status: true,
      data: counter,
      message: "Counter created successfully",
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

module.exports.getCounterByID = async function (id) {
  try {
    winston.info(`Getting information of counter: ${id}`);

    const counter = await Counter.findById(id);
    if (_.isEmpty(counter)) {
      winston.debug("Invalid Counter");
      return {
        status: false,
        data: null,
        message: "Invalid Counter",
        errorCode: 200,
      };
    }

    return { status: true, data: counter, message: "", errorCode: null };
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

module.exports.getAllCounter = async function () {
  try {
    winston.info("Getting All Counter");

    const counter = await Counter.find({ isDeleted: false });
    if (_.isEmpty(counter)) {
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
      data: counter,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateCounter = async function (req) {
  try {
    winston.info("Update Counter");

    const counter = await Counter.findById(req.body._id);
    if (_.isEmpty(counter)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    // if (counter.isDeleted) {
    //   return {
    //     status: false,
    //     data: null,
    //     message: "Counter Already removed!",
    //     errorCode: 200,
    //   };
    // }

    counter.type = req.body.type;
    counter.sequenceNumber = req.body.sequenceNumber;
    counter.noOfDigits = req.body.noOfDigits;
    counter.prefix = req.body.prefix;
    counter.suffix = req.body.suffix;

    let updatedCounter = await new Counter(counter).save();
    if (updatedCounter) {
      activityLog.collectionName = "counter";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_counter";
      activityLog.doc = updatedCounter;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedCounter,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteCounter = async function (id, user) {
  try {
    winston.info("Update Counter");

    const counter = await Counter.findById(id);
    if (_.isEmpty(counter)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (counter.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Counter Already removed!",
        errorCode: 200,
      };
    }

    counter.isDeleted = true;

    counter.deletedAt = Date.now();
    counter.deletedBy = user._id;

    let deletedCounter = await new Counter(counter).save();
    if (deletedCounter) {
      activityLog.collectionName = "counter";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_counter";
      activityLog.doc = deletedCounter;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedCounter,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
