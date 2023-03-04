"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateFyear(fyear) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    prefix: Joi.string().required(),
    suffix: Joi.string().required(),
    fullYear: Joi.string().required(),
    startDt: Joi.date().required(),
    endDt: Joi.date().required(),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(fyear, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateFyear = validateCreateFyear;
