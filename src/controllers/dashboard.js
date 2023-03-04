"use strict";
const winston = require("winston");
const _ = require("lodash");

const { CustomerVendor } = require("../models/customerVendor");
const { Booking } = require("../models/booking");
const { Commodity } = require("../models/commodity");

module.exports.getDashboard = async function () {
  try {
    winston.info("Getting All Contracts");

    const customerCount = await CustomerVendor.countDocuments({
      isDeleted: false,
      category: "CUSTOMER",
    });
    const vendorCount = await CustomerVendor.countDocuments({
      isDeleted: false,
      category: "VENDOR",
    });

    const commodityCount = await Commodity.countDocuments({
      isDeleted: false,
    });
    const bookingsCount = await Booking.countDocuments({
      isDeleted: false,
    });

    return {
      status: true,
      data: {
        customerCount,
        vendorCount,
        commodityCount,
        bookingsCount,
        invoiceCount: 0,
      },
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
