"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateCounter(counter) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    roleName: Joi.string().required(),
    type: Joi.string().required(),
    sequenceNumber: Joi.string().required(),
    noOfDigits: Joi.string().required(),
    prefix: Joi.string().optional().default("").allow("").allow(null),
    suffix: Joi.string().optional().default("").allow("").allow(null),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(counter, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateCounter = validateCreateCounter;
