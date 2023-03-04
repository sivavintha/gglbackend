"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Branch } = require("../models/branch");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateBranch } = require("../validations/branch");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.createBranch = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;

    let counter = await Counter.findOne({ type: "BRANCH" });
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
    const { error, value } = validateCreateBranch(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the branch
    winston.info(`Registering Branch: ${req.body.name}`);

    const branch = new Branch(req.body);

    await branch.save();

    
    if (branch) {
      await Counter.findOneAndUpdate(
        { type: "BRANCH" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created Branch successfully");

    return {
      status: true,
      data: branch,
      message: "Branch created successfully",
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

module.exports.getBranchByID = async function (id) {
  try {
    winston.info(`Getting information of branch: ${id}`);

    const branch = await Branch.findById(id);
    if (_.isEmpty(branch)) {
      winston.debug("Invalid Branch");
      return {
        status: false,
        data: null,
        message: "Invalid Branch",
        errorCode: 200,
      };
    }

    return { status: true, data: branch, message: "", errorCode: null };
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

module.exports.getAllBranch = async function () {
  try {
    winston.info("Getting All Branch");

    const branch = await Branch.find({ isDeleted: false });
    if (_.isEmpty(branch)) {
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
      data: branch,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateBranch = async function (req) {
  try {
    winston.info("Update Branch");

    const branch = await Branch.findById(req.body._id);
    if (_.isEmpty(branch)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (branch.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Branch Already removed!",
        errorCode: 200,
      };
    }

    branch.branchName = req.body.branchName;
    branch.branchShortName = req.body.branchShortName;

   
    branch.updatedBy = req.user._id;
    let updatedBranch = await new Branch(branch).save();
    if (updatedBranch) {
      activityLog.collectionName = "branch";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_branch";
      activityLog.doc = updatedBranch;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedBranch,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteBranch = async function (id, user) {
  try {
    winston.info("Update Branch");

    const branch = await Branch.findById(id);
    if (_.isEmpty(branch)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (branch.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Branch Already removed!",
        errorCode: 200,
      };
    }

    branch.isDeleted = true;

    branch.deletedAt = Date.now();
    branch.deletedBy = user._id;

    let deletedBranch = await new Branch(branch).save();
    if (deletedBranch) {
      activityLog.collectionName = "branch";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_branch";
      activityLog.doc = deletedBranch;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedBranch,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
