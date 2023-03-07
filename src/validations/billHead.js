"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateBillHead(billHead) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    code: Joi.string().required(),
    billHeadName: Joi.string().required(),
    sac: Joi.string().optional().allow("").allow(null),
    gstApplicable: Joi.boolean().optional().default(true),
    gstSlab: Joi.string().required(),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(billHead, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateBillHead = validateCreateBillHead;
