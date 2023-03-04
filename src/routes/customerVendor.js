"use strict";
const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware.auth");
const winston = require("winston");
const errMW = require("../middleware/middleware.error");

const {
  createCustomerVendor,
  getAllCustomerVendor,
  getCustomerVendorByID,
  updateCustomerVendor,
  deleteCustomerVendor,
} = require("../controllers/customerVendor");

// CREATE CustomerVendor
router.post("/create", [auth], async (req, res) => {
  try {
    winston.info(`Creating CustomerVendor : ${req.body.name}`);
    const result = await createCustomerVendor(req);
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

// UPDATE CustomerVendor
router.put("/update", [auth], async (req, res) => {
  try {
    winston.info(`Update CustomerVendor : ${req.body.name}`);
    const result = await updateCustomerVendor(req);
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

//Getting All CustomerVendor
router.get("/all/:category", [auth], async (req, res) => {
  try {
    winston.info("Getting All CustomerVendor by query");
    const result = await getAllCustomerVendor({
      category: req.params.category,
    });
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

//Getting CustomerVendor By ID
router.get("/:id", [auth], async (req, res) => {
  try {
    winston.info("Getting CustomerVendor by ID");
    const result = await getCustomerVendorByID(req.params.id);
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

//delete CustomerVendor By ID
router.delete("/:id", [auth], async (req, res) => {
  try {
    winston.info("Deleting CustomerVendor by ID");
    const result = await deleteCustomerVendor(req.params.id, req.user);
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
