"use strict";
const winston = require("winston");
const _ = require("lodash");
const { Invoice } = require("../models/invoice");
const { ActivityLog } = require("../models/activityLog");
const { validateCreateInvoice } = require("../validations/invoice");
const { Counter } = require("../models/counter");
const { Fyear } = require("../models/fyear");
const { BillHead } = require("../models/billHead");

let activityLog = {};

module.exports.createInvoice = async function (req) {
  try {
    winston.debug("Transaction started");

    req.body.createdBy = req.user._id;
    req.body.isDeleted = false;
    req.body.deletedAt = null;
    req.body.deletedBy = null;
    req.body.updatedBy = null;
    req.body.isCancelled = false;
    req.body.cancelledAt = null;
    req.body.cancelledBy = null;
    req.body.finalledAt = null;

    let counter = await Counter.findOne({ type: "INVOICE" });
    if (!counter) {
      return {
        status: false,
        data: null,
        message: "Counter not found!",
        errorCode: 400,
      };
    }

    const fyear = await Fyear.findById(req.body.fyear);
    if (!fyear) {
      return {
        status: false,
        data: null,
        message: "Fyear not found!",
        errorCode: 400,
      };
    }
    const code =
      counter.prefix +
      "/" +
      fyear.suffix +
      "/" +
      (+counter.sequenceNumber + 1).toString().padStart(counter.noOfDigits, 0) +
      counter.suffix;
    req.body.invoiceNo = code;

    // Validation
    const { error, value } = validateCreateInvoice(req.body);
    if (error) {
      return { status: false, data: null, message: error, errorCode: 400 };
    }

    // Now registering the invoice
    winston.info(`Registering Invoice: ${req.body.name}`);

    const invoice = new Invoice(req.body);

    await invoice.save();

    if (invoice) {
      await Counter.findOneAndUpdate(
        { type: "COUNTER" },
        { $inc: { sequenceNumber: 1 } },
        { new: true }
      );
    }

    winston.info("Created Invoice successfully");

    return {
      status: true,
      data: invoice,
      message: "Invoice created successfully",
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

module.exports.getInvoiceByID = async function (id) {
  try {
    winston.info(`Getting information of invoice: ${id}`);

    const invoice = await Invoice.findById(id)
      .populate("billingParty")
      .populate({
        path: "bookingNo",
        populate: [
          { path: "pol", model: "seaports" },
          { path: "pod", model: "seaports" },
          {
            path: "sellRate",
            populate: [
              {
                path: "narration",
                model: "billheads",
                populate: {
                  path: "gstSlab",
                  model: "gst",
                },
              },
              { path: "billingTo", model: "customervendor" },
            ],
          },
          {
            path: "buyRate",
            populate: [
              {
                path: "narration",
                model: "billheads",
                populate: {
                  path: "gstSlab",
                  model: "gst",
                },
              },
              { path: "billingTo", model: "customervendor" },
            ],
          },
        ],
      });

    if (_.isEmpty(invoice)) {
      winston.debug("Invalid Invoice");
      return {
        status: false,
        data: null,
        message: "Invalid Invoice",
        errorCode: 200,
      };
    }

    return { status: true, data: invoice, message: "", errorCode: null };
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

module.exports.getAllInvoice = async function () {
  try {
    winston.info("Getting All Invoice");

    const invoice = await Invoice.find({ isDeleted: false })
      .populate("billingParty")
      .populate("bookingNo");
    if (_.isEmpty(invoice)) {
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
      data: invoice,
      message: "data fetched successfully",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.updateInvoice = async function (req) {
  try {
    winston.info("Update Invoice");

    const invoice = await Invoice.findById(req.body._id);
    if (_.isEmpty(invoice)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (invoice.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Invoice Already removed!",
        errorCode: 200,
      };
    }

    if (invoice.isCancelled) {
      return {
        status: false,
        data: null,
        message: "Invoice Already cancelled!",
        errorCode: 200,
      };
    }

    if (!invoice.isFinalled) {
      invoice.isFinalled = req.body.isFinalled
        ? req.body.isFinalled
        : invoice.isFinalled;
      invoice.finalledAt = Date.now();
      invoice.billingParty = invoice.billingParty;
      invoice.billingTo = invoice.billingTo;
      invoice.bookingNo = invoice.bookingNo;
      invoice.invoiceDate = invoice.invoiceDate;
    }

    invoice.updatedBy = req.user._id;
    let updatedInvoice = await new Invoice(invoice).save();
    if (updatedInvoice) {
      activityLog.collectionName = "invoice";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_invoice";
      activityLog.doc = updatedInvoice;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedInvoice,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.cancelInvoice = async function (req) {
  try {
    winston.info("Cancel Invoice");

    const invoice = await Invoice.findById(req.body._id);
    if (_.isEmpty(invoice)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (invoice.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Invoice Already removed!",
        errorCode: 200,
      };
    }

    if (invoice.isCancelled) {
      return {
        status: false,
        data: null,
        message: "Invoice Already cancelled!",
        errorCode: 200,
      };
    }

    invoice.isCancelled = true;
    invoice.cancelledAt = Date.now();
    invoice.cancelledBy = req.user._id;

    invoice.updatedBy = req.user._id;
    let updatedInvoice = await new Invoice(invoice).save();
    if (updatedInvoice) {
      activityLog.collectionName = "invoice";
      activityLog.type = "UPDATE";
      activityLog.operation = "update_invoice_cancel";
      activityLog.doc = updatedInvoice;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: updatedInvoice,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};

module.exports.deleteInvoice = async function (id, user) {
  try {
    winston.info("Update Invoice");

    const invoice = await Invoice.findById(id);
    if (_.isEmpty(invoice)) {
      return {
        status: false,
        data: null,
        message: "No data found",
        errorCode: 200,
      };
    }

    if (invoice.isDeleted) {
      return {
        status: false,
        data: null,
        message: "Invoice Already removed!",
        errorCode: 200,
      };
    }

    invoice.isDeleted = true;

    invoice.deletedAt = Date.now();
    invoice.deletedBy = user._id;

    let deletedInvoice = await new Invoice(invoice).save();
    if (deletedInvoice) {
      activityLog.collectionName = "invoice";
      activityLog.type = "DELETE";
      activityLog.operation = "delete_invoice";
      activityLog.doc = deletedInvoice;

      await new ActivityLog(activityLog).save();
    }

    return {
      status: true,
      data: deletedInvoice,
      message: "",
      errorCode: null,
    };
  } catch (error) {
    return { status: false, data: null, message: error, errorCode: 400 };
  }
};
