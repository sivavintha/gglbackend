"use strict";
const winston = require("winston");
const _ = require("lodash");
const { CustomerVendor } = require("../models/customerVendor");
const { ActivityLog } = require("../models/activityLog");
const {
  validateCreateCustomerVendor,
} = require("../validations/customerVendor");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.createCustomerVendor = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    let counter = await Counter.findOne({ type: "CUSTOMERVENDOR" });
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
    const { error, value } = validateCreateCustomerVendor(req.body);
    if (error) {
      console.log("error ===>", error);
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the customerVendor
    winston.info(`Registering CustomerVendor: ${req.body.name}`);

    const customerVendor = new CustomerVendor(req.body);

    await customerVendor.save();

    if (customerVendor) {
      await Counter.findOneAndUpdate(
        { type: "CUSTOMERVENDOR" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created CustomerVendor successfully");

    return {
      status: true,
      data: customerVendor,
      message: "CustomerVendor created successfully",
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

module.exports.getCustomerVendorByID = async function (id) {
  try {
    winston.info(`Getting information of customerVendor: ${id}`);

    const customerVendor = await CustomerVendor.findById(id);
    if (_.isEmpty(customerVendor)) {
      winston.debug("Invalid CustomerVendor");
      return {
        status: false,
        data: null,
        message: "Invalid CustomerVendor",
        errorCode: 200,
      };
    }

    return { status: true, data: customerVendor, message: "", errorCode: null };
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

module.exports.getAllCustomerVendor = async function (category) {
  try {
    winston.info("Getting All CustomerVendor");

    const customerVendor = await CustomerVendor.find({
      isDeleted: false,
      ...category,
    });
    if (_.isEmpty(customerVendor)) {
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
      data: customerVendor,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateCustomerVendor = async function (req) {
  try {
    winston.info("Update CustomerVendor");

    const customerVendor = await CustomerVendor.findById(req.body._id);
    if (_.isEmpty(customerVendor)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (customerVendor.isDeleted) {
      return {
        status: false,
        data: null,
        message: "CustomerVendor Already removed!",
        errorCode: 200,
      };
    }

    // customerVendor.category= req.body.category;
    // customerVendor.code= req.body.roleName;
    customerVendor.name = req.body.name;
    customerVendor.address1 = req.body.address1;
    customerVendor.address2 = req.body.address2;
    customerVendor.city = req.body.city;
    customerVendor.state = req.body.state;
    customerVendor.stateTin = req.body.stateTin;
    customerVendor.country = req.body.country;
    customerVendor.zipcode = req.body.zipcode;
    customerVendor.emailId = req.body.emailId;
    customerVendor.geoCode = req.body.geoCode;
    customerVendor.mobileNumber = req.body.mobileNumber;
    customerVendor.profitCenter = req.body.profitCenter;

    customerVendor.gstInNumber = req.body.gstInNumber;
    // customerVendor.panNumber= req.body.panNumber;

    customerVendor.isShipper = req.body.isShipper;
    customerVendor.isConsignee = req.body.isConsignee;
    customerVendor.isNotifier = req.body.isNotifier;
    customerVendor.isOverseasAgent = req.body.isOverseasAgent;
    customerVendor.isCHA = req.body.isCHA;
    customerVendor.isLine = req.body.isLine;
    customerVendor.isTransporter = req.body.isTransporter;
    customerVendor.isSupplier = req.body.isSupplier;
    customerVendor.isDeliveryAgent = req.body.isDeliveryAgent;
    customerVendor.isWarehouse = req.body.isWarehouse;

    customerVendor.creditDays = req.body.creditDays;

    customerVendor.updatedBy = req.user._id;
    let updatedCustomerVendor = await new CustomerVendor(customerVendor).save();
    if (updatedCustomerVendor) {
      activityLog.collectionName = "customerVendor";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_customerVendor";
      activityLog.doc = updatedCustomerVendor;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedCustomerVendor,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteCustomerVendor = async function (id, user) {
  try {
    winston.info("Update CustomerVendor");

    const customerVendor = await CustomerVendor.findById(id);
    if (_.isEmpty(customerVendor)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (customerVendor.isDeleted) {
      return {
        status: false,
        data: null,
        message: "CustomerVendor Already removed!",
        errorCode: 200,
      };
    }

    customerVendor.isDeleted = true;

    customerVendor.deletedAt = Date.now();
    customerVendor.deletedBy = user._id;

    let deletedCustomerVendor = await new CustomerVendor(customerVendor).save();
    if (deletedCustomerVendor) {
      activityLog.collectionName = "customerVendor";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_customerVendor";
      activityLog.doc = deletedCustomerVendor;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedCustomerVendor,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
