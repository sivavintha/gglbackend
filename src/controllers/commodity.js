"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Commodity } = require("../models/commodity");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateCommodity } = require("../validations/commodity");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.createCommodity = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    let counter = await Counter.findOne({ type: "COMMODITY" });
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
    const { error, value } = validateCreateCommodity(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the commodity
    winston.info(`Registering Commodity: ${req.body.name}`);

    const commodity = new Commodity(req.body);

    await commodity.save();

    
    if (commodity) {
      await Counter.findOneAndUpdate(
        { type: "COMMODITY" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created Commodity successfully");

    return {
      status: true,
      data: commodity,
      message: "Commodity created successfully",
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

module.exports.getCommodityByID = async function (id) {
  try {
    winston.info(`Getting information of commodity: ${id}`);

    const commodity = await Commodity.findById(id);
    if (_.isEmpty(commodity)) {
      winston.debug("Invalid Commodity");
      return {
        status: false,
        data: null,
        message: "Invalid Commodity",
        errorCode: 200,
      };
    }

    return { status: true, data: commodity, message: "", errorCode: null };
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

module.exports.getAllCommodity = async function () {
  try {
    winston.info("Getting All Commodity");

    const commodity = await Commodity.find({ isDeleted: false });
    if (_.isEmpty(commodity)) {
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
      data: commodity,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateCommodity = async function (req) {
  try {
    winston.info("Update Commodity");

    const commodity = await Commodity.findById(req.body._id);
    if (_.isEmpty(commodity)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (commodity.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Commodity Already removed!",
        errorCode: 200,
      };
    }

    commodity.commodityName = req.body.commodityName;
   
    commodity.updatedBy = req.user._id;
    let updatedCommodity = await new Commodity(commodity).save();
    if (updatedCommodity) {
      activityLog.collectionName = "commodity";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_commodity";
      activityLog.doc = updatedCommodity;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedCommodity,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteCommodity = async function (id, user) {
  try {
    winston.info("Update Commodity");

    const commodity = await Commodity.findById(id);
    if (_.isEmpty(commodity)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (commodity.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Commodity Already removed!",
        errorCode: 200,
      };
    }

    commodity.isDeleted = true;

    commodity.deletedAt = Date.now();
    commodity.deletedBy = user._id;

    let deletedCommodity = await new Commodity(commodity).save();
    if (deletedCommodity) {
      activityLog.collectionName = "commodity";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_commodity";
      activityLog.doc = deletedCommodity;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedCommodity,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
