"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateInvoice(invoice) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    invoiceNo: Joi.string().required(),
    fyear: Joi.string().required(),
    pc_code: Joi.string().required(),

    billingParty: Joi.string().required(),
    billingTo: Joi.string().required(),

    bookingNo: Joi.string().required(),
    invoiceCategory: Joi.string().required(),

    invoiceDate: Joi.date().required(),
    isFinalled: Joi.boolean().required(),
    finalledAt: Joi.date().required().allow(null).allow(""),
   
    cancelledBy: joiObjectId().allow(null).allow(""),
    isCancelled: Joi.boolean().default(false),
    cancelledAt: Joi.date().allow(null),
 
    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(invoice, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateInvoice = validateCreateInvoice;
