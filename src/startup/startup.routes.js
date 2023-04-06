"use strict";
const express = require("express");

const users = require("../routes/user");
const seaPorts = require("../routes/seaPorts");
const roles = require("../routes/roles");
const profitCenter = require("../routes/profitCenter");
const gst = require("../routes/gst");
const fyear = require("../routes/fyear");
const customerVendor = require("../routes/customerVendor");
const counter = require("../routes/counter");
const commodity = require("../routes/commodity");
const branch = require("../routes/branch");
const booking = require("../routes/booking");
const billHead = require("../routes/billHead");
const dashboard = require("../routes/dashboard");
const invoice = require("../routes/invoice");
const containerType = require("../routes/containerType");
const basisType = require("../routes/basisType");
const currency = require("../routes/currency");
const movementType = require("../routes/movementType");


const cors = require("cors");

const corsOptions = function (req, callback) {
  var corsOptions = {
    origin: "*",
    exposedHeaders: "x-auth-token",
  };
  callback(null, corsOptions);
};

module.exports = function (app) {
  app.use(express.json({ limit: "50mb" }));
  app.use(cors(corsOptions));
  app.use("/default", express.static("public/images"));
  app.use("/css", express.static("public/css"));
  // app.use("/bprofile", express.static("src/uploads/buyers"));

  app.use("/api/users", users);
  app.use("/api/seaports", seaPorts);
  app.use("/api/roles", roles);
  app.use("/api/profitcenter", profitCenter);
  app.use("/api/gst", gst);
  app.use("/api/fyear", fyear);
  app.use("/api/customervendor", customerVendor);
  app.use("/api/counter", counter);
  app.use("/api/commodity", commodity);
  app.use("/api/branch", branch);
  app.use("/api/booking", booking);
  app.use("/api/billhead", billHead);
  app.use("/api/dashboard", dashboard);
  app.use("/api/invoice", invoice);
  app.use("/api/containertype", containerType);
  app.use("/api/basistype", basisType);
  app.use("/api/currency", currency);
  app.use("/api/movementtype", movementType);

  // app.use(error);
};
