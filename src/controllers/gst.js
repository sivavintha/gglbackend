"use strict";
const winston = require("winston");
const _ = require("lodash");
const { GST } = require("../models/gst");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateGST } = require("../validations/gst");
const moment = require("moment");
let activityLog = {};

module.exports.createGST = async function (req) {
  try {
    winston.debug("Transaction started");

    const effectiveFrom = moment.utc(req.body.effectiveFrom).toISOString();
    const effectiveTo = req.body.effectiveFrom
      ? moment.utc(req.body.effectiveTo).toISOString()
      : null;

    console.log("effectivefrom, effectiveTo ===>", effectiveFrom, effectiveTo);

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    // Validation
    const { error, value } = validateCreateGST(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the gst
    winston.info(`Registering GST: ${req.body.name}`);

    const gst = new GST(req.body);

    await gst.save();

    winston.info("Created GST Slab successfully");

    return {
      status: true,
      data: gst,
      message: "GST Slab created successfully",
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

module.exports.getGSTByID = async function (id) {
  try {
    winston.info(`Getting information of gst: ${id}`);

    const gst = await GST.findById(id);
    if (_.isEmpty(gst)) {
      winston.debug("Invalid GST");
      return {
        status: false,
        data: null,
        message: "Invalid GST",
        errorCode: 200,
      };
    }

    return { status: true, data: gst, message: "", errorCode: null };
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

module.exports.getAllGST = async function () {
  try {
    winston.info("Getting All GST");

    const gst = await GST.find({ isDeleted: false });
    if (_.isEmpty(gst)) {
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
      data: gst,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateGST = async function (req) {
  try {
    winston.info("Update GST");

    const gst = await GST.findById(req.body._id);
    if (_.isEmpty(gst)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (gst.isDeleted) {
      return {
        status: false,
        data: null,
        message: "GST Already removed!",
        errorCode: 200,
      };
    }

    gst.gst = req.body.gst;
    gst.cgst = req.body.cgst;
    gst.sgst = req.body.sgst;
    gst.igst = req.body.igst;
    gst.effectiveFrom = req.body.effectiveFrom;
    gst.effectiveTo = req.body.effectiveTo;

    gst.updatedBy = req.user._id;
    let updatedGST = await new GST(gst).save();
    if (updatedGST) {
      activityLog.collectionName = "gst";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_gst";
      activityLog.doc = updatedGST;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedGST,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteGST = async function (id, user) {
  try {
    winston.info("Update GST");

    const gst = await GST.findById(id);
    if (_.isEmpty(gst)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (gst.isDeleted) {
      return {
        status: false,
        data: null,
        message: "GST Already removed!",
        errorCode: 200,
      };
    }

    gst.isDeleted = true;

    gst.deletedAt = Date.now();
    gst.deletedBy = user._id;

    let deletedGST = await new GST(gst).save();
    if (deletedGST) {
      activityLog.collectionName = "gst";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_gst";
      activityLog.doc = deletedGST;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedGST,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
