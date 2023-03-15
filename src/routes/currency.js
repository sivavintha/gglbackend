"use strict";
const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware.auth");
const winston = require("winston");
const errMW = require("../middleware/middleware.error");

const { getAllCurrency, getCurrencyByID } = require("../controllers/currency");

//Getting All Currency
router.get("/all", [auth], async (req, res) => {
  try {
    winston.info("Getting All Currency by query");
    const result = await getAllCurrency(req.body);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

//Getting Currency By ID
router.get("/:id", [auth], async (req, res) => {
  try {
    winston.info("Getting Currency by ID");
    const result = await getCurrencyByID(req.params.id);
    if (result.status) {
      return res.status(200).send({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    } else {
      if (result.errorCode === 400) {
        errMW(result.message, req, res);
      } else {
        return res.status(result.errorCode).send({
          status: result.status,
          data: result.data,
          message: result.message,
        });
      }
    }
  } catch (error) {
    errMW(error, req, res);
  }
});

module.exports = router;
