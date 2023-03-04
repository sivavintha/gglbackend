"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateGST(gst) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    gst: Joi.number().required().error(new Error("Invalid GST Rate")),
    cgst: Joi.number().required().error(new Error("Invalid CGST Rate")),
    sgst: Joi.number().required().error(new Error("Invalid SGST Rate")),
    igst: Joi.number().required().error(new Error("Invalid IGST Rate")),
    effectiveFrom: Joi.date()
      .required()
      .error(new Error("Invalid Effective from date")),
    effectiveTo: Joi.date().allow(null),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(gst, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateGST = validateCreateGST;
