"use strict";
const winston = require("winston");
const _ = require("lodash");
const { ContainerType } = require("../models/containerType");
const { ActivityLog } = require("../models/activityLog");
// const { validateCreateContainerType } = require("../validations/containerType");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.getContainerTypeByID = async function (id) {
  try {
    winston.info(`Getting information of containerType: ${id}`);

    const containerType = await ContainerType.findById(id);
    if (_.isEmpty(containerType)) {
      winston.debug("Invalid ContainerType");
      return {
        status: false,
        data: null,
        message: "Invalid ContainerType",
        errorCode: 200,
      };
    }

    return { status: true, data: containerType, message: "", errorCode: null };
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

module.exports.getAllContainerType = async function () {
  try {
    winston.info("Getting All ContainerType");

    const containerType = await ContainerType.find({ isDeleted: false });
    if (_.isEmpty(containerType)) {
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
      data: containerType,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
