"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Roles } = require("../models/roles");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateRoles } = require("../validations/roles");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.createRoles = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user? req.user._id : null;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    let counter = await Counter.findOne({ type: "ROLE" });
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
    const { error, value } = validateCreateRoles(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the roles
    winston.info(`Registering Roles: ${req.body.name}`);

    const roles = new Roles(req.body);

    await roles.save();

    
    if (roles) {
      await Counter.findOneAndUpdate(
        { type: "ROLE" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created Roles successfully");

    return {
      status: true,
      data: roles,
      message: "Roles created successfully",
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

module.exports.getRolesByID = async function (id) {
  try {
    winston.info(`Getting information of roles: ${id}`);

    const roles = await Roles.findById(id);
    if (_.isEmpty(roles)) {
      winston.debug("Invalid Roles");
      return {
        status: false,
        data: null,
        message: "Invalid Roles",
        errorCode: 200,
      };
    }

    return { status: true, data: roles, message: "", errorCode: null };
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

module.exports.getAllRoles = async function () {
  try {
    winston.info("Getting All Roles");

    const roles = await Roles.find({ isDeleted: false });
    if (_.isEmpty(roles)) {
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
      data: roles,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateRoles = async function (req) {
  try {
    winston.info("Update Roles");

    const roles = await Roles.findById(req.body._id);
    if (_.isEmpty(roles)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (roles.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Roles Already removed!",
        errorCode: 200,
      };
    }

    roles.roleName = req.body.roleName;
   
    roles.updatedBy = req.user._id;
    let updatedRoles = await new Roles(roles).save();
    if (updatedRoles) {
      activityLog.collectionName = "roles";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_roles";
      activityLog.doc = updatedRoles;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedRoles,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteRoles = async function (id, user) {
  try {
    winston.info("Update Roles");

    const roles = await Roles.findById(id);
    if (_.isEmpty(roles)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (roles.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Roles Already removed!",
        errorCode: 200,
      };
    }

    roles.isDeleted = true;

    roles.deletedAt = Date.now();
    roles.deletedBy = user._id;

    let deletedRoles = await new Roles(roles).save();
    if (deletedRoles) {
      activityLog.collectionName = "roles";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_roles";
      activityLog.doc = deletedRoles;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedRoles,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
