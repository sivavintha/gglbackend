"use strict";
const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware.auth");
const winston = require("winston");
const errMW = require("../middleware/middleware.error");

const {
  createCounter,
  getAllCounter,
  getCounterByID,
  updateCounter,
  deleteCounter,
} = require("../controllers/counter");

// CREATE Counter
router.post("/create", [auth], async (req, res) => {
  try {
    winston.info(`Creating Counter : ${req.body.name}`);
    const result = await createCounter(req);
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

// UPDATE Counter
router.put("/update", [auth], async (req, res) => {
  try {
    winston.info(`Update Counter : ${req.body.name}`);
    const result = await updateCounter(req);
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

//Getting All Counter
router.get("/all", [auth], async (req, res) => {
  try {
    winston.info("Getting All Counter by query");
    const result = await getAllCounter(req.body);
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

//Getting Counter By ID
router.get("/:id", [auth], async (req, res) => {
  try {
    winston.info("Getting Counter by ID");
    const result = await getCounterByID(req.params.id);
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

//delete Counter By ID
router.delete("/:id", [auth], async (req, res) => {
  try {
    winston.info("Deleting Counter by ID");
    const result = await deleteCounter(req.params.id, req.user);
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
