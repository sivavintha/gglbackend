"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Currency } = require("../models/currency");
const { ActivityLog } = require("../models/activityLog");
// const { validateCreateCurrency } = require("../validations/currency");
const { Counter } = require("../models/counter");

let activityLog = {};

module.exports.getCurrencyByID = async function (id) {
  try {
    winston.info(`Getting information of currency: ${id}`);

    const currency = await Currency.findById(id);
    if (_.isEmpty(currency)) {
      winston.debug("Invalid Currency");
      return {
        status: false,
        data: null,
        message: "Invalid Currency",
        errorCode: 200,
      };
    }

    return { status: true, data: currency, message: "", errorCode: null };
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

module.exports.getAllCurrency = async function () {
  try {
    winston.info("Getting All Currency");

    const currency = await Currency.find({ isDeleted: false });
    if (_.isEmpty(currency)) {
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
      data: currency,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
