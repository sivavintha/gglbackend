"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateSeaPorts(seaPorts) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    portCode: Joi.string().required(),
    portName: Joi.string().required(),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(seaPorts, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateSeaPorts = validateCreateSeaPorts;
