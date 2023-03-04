"use strict";
const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware.auth");
const winston = require("winston");
const errMW = require("../middleware/middleware.error");

const {
  createFyear,
  getAllFyear,
  getFyearByID,
  updateFyear,
  deleteFyear,
} = require("../controllers/fyear");

// CREATE Fyear
router.post("/create", [auth], async (req, res) => {
  try {
    winston.info(`Creating Fyear : ${req.body.name}`);
    const result = await createFyear(req);
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

// UPDATE Fyear
router.put("/update", [auth], async (req, res) => {
  try {
    winston.info(`Update Fyear : ${req.body.name}`);
    const result = await updateFyear(req);
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

//Getting All Fyear
router.get("/all", [auth], async (req, res) => {
  try {
    winston.info("Getting All Fyear by query");
    const result = await getAllFyear(req.body);
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

//Getting Fyear By ID
router.get("/:id", [auth], async (req, res) => {
  try {
    winston.info("Getting Fyear by ID");
    const result = await getFyearByID(req.params.id);
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

//delete Fyear By ID
router.delete("/:id", [auth], async (req, res) => {
  try {
    winston.info("Deleting Fyear by ID");
    const result = await deleteFyear(req.params.id, req.user);
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
