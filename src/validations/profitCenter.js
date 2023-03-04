"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateProfitCenter(profitCenter) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    profitCenterName: Joi.string().required(),
    profitCenterShortName: Joi.string().required(),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(profitCenter, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateProfitCenter = validateCreateProfitCenter;
