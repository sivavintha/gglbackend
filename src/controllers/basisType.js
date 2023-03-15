"use strict";
const winston = require("winston");
const _ = require("lodash");
const { BasisType } = require("../models/basisType");
const { ActivityLog } = require("../models/activityLog");
// const { validateCreateBasisType } = require("../validations/basisType");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.getBasisTypeByID = async function (id) {
  try {
    winston.info(`Getting information of basisType: ${id}`);

    const basisType = await BasisType.findById(id);
    if (_.isEmpty(basisType)) {
      winston.debug("Invalid BasisType");
      return {
        status: false,
        data: null,
        message: "Invalid BasisType",
        errorCode: 200,
      };
    }

    return { status: true, data: basisType, message: "", errorCode: null };
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

module.exports.getAllBasisType = async function () {
  try {
    winston.info("Getting All BasisType");

    const basisType = await BasisType.find({ isDeleted: false });
    if (_.isEmpty(basisType)) {
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
      data: basisType,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
