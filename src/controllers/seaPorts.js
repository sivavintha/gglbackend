"use strict";
const winston = require("winston");
const _ = require("lodash");
const { SeaPorts } = require("../models/seaPorts");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateSeaPorts } = require("../validations/seaPorts");
let activityLog = {};

module.exports.createSeaPorts = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    // Validation
    const { error, value } = validateCreateSeaPorts(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the seaPorts
    winston.info(`Registering SeaPorts: ${req.body.name}`);

    const seaPorts = new SeaPorts(req.body);

    await seaPorts.save();

    winston.info("Created SeaPorts successfully");

    return {
      status: true,
      data: seaPorts,
      message: "SeaPorts created successfully",
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

module.exports.getSeaPortsByID = async function (id) {
  try {
    winston.info(`Getting information of seaPorts: ${id}`);

    const seaPorts = await SeaPorts.findById(id);
    if (_.isEmpty(seaPorts)) {
      winston.debug("Invalid SeaPorts");
      return {
        status: false,
        data: null,
        message: "Invalid SeaPorts",
        errorCode: 200,
      };
    }

    return { status: true, data: seaPorts, message: "", errorCode: null };
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

module.exports.getAllSeaPorts = async function () {
  try {
    winston.info("Getting All SeaPorts");

    const seaPorts = await SeaPorts.find({ isDeleted: false });
    if (_.isEmpty(seaPorts)) {
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
      data: seaPorts,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateSeaPorts = async function (req) {
  try {
    winston.info("Update SeaPorts");

    const seaPorts = await SeaPorts.findById(req.body._id);
    if (_.isEmpty(seaPorts)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (seaPorts.isDeleted) {
      return {
        status: false,
        data: null,
        message: "SeaPorts Already removed!",
        errorCode: 200,
      };
    }

    seaPorts.portCode = req.body.portCode;
    seaPorts.portName = req.body.portName;
   
    seaPorts.updatedBy = req.user._id;
    let updatedSeaPorts = await new SeaPorts(seaPorts).save();
    if (updatedSeaPorts) {
      activityLog.collectionName = "seaPorts";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_seaPorts";
      activityLog.doc = updatedSeaPorts;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedSeaPorts,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteSeaPorts = async function (id, user) {
  try {
    winston.info("Update SeaPorts");

    const seaPorts = await SeaPorts.findById(id);
    if (_.isEmpty(seaPorts)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (seaPorts.isDeleted) {
      return {
        status: false,
        data: null,
        message: "SeaPorts Already removed!",
        errorCode: 200,
      };
    }

    seaPorts.isDeleted = true;

    seaPorts.deletedAt = Date.now();
    seaPorts.deletedBy = user._id;

    let deletedSeaPorts = await new SeaPorts(seaPorts).save();
    if (deletedSeaPorts) {
      activityLog.collectionName = "seaPorts";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_seaPorts";
      activityLog.doc = deletedSeaPorts;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedSeaPorts,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
