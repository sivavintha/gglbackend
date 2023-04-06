"use strict";
const winston = require("winston");
const _ = require("lodash");
const { MovementType } = require("../models/movementType");
const { ActivityLog } = require("../models/activityLog");
// const { validateCreateMovementType } = require("../validations/movementType");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.getMovementTypeByID = async function (id) {
  try {
    winston.info(`Getting information of movementType: ${id}`);

    const movementType = await MovementType.findById(id);
    if (_.isEmpty(movementType)) {
      winston.debug("Invalid MovementType");
      return {
        status: false,
        data: null,
        message: "Invalid MovementType",
        errorCode: 200,
      };
    }

    return { status: true, data: movementType, message: "", errorCode: null };
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

module.exports.getAllMovementType = async function () {
  try {
    winston.info("Getting All MovementType");

    const movementType = await MovementType.find({ isDeleted: false });
    if (_.isEmpty(movementType)) {
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
      data: movementType,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
