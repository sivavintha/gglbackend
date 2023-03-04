"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateCustomerVendor(customerVendor) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    category: Joi.string().required(),
    code: Joi.string().required(),
    name: Joi.string().required(),
    address1: Joi.string().optional().default("").allow("").allow(null),
    address2: Joi.string().optional().default("").allow("").allow(null),
    city: Joi.string().optional().default("").allow("").allow(null),
    state: Joi.string().optional().default("").allow("").allow(null),
    stateTin: Joi.string().optional().default("").allow("").allow(null),
    country: Joi.string().optional().default("").allow("").allow(null),
    zipcode: Joi.string().optional().default("").allow("").allow(null),
    emailId: Joi.string().optional().default("").allow("").allow(null),
    geoCode: Joi.string().optional().default("+91"),
    mobileNumber: Joi.string().optional().default("").allow("").allow(null),
    profitCenter: Joi.string().required(),

    gstInNumber: Joi.string().optional().allow("").allow("null"),

    isShipper: Joi.boolean().optional().default(false),
    isConsignee: Joi.boolean().optional().default(false),
    isNotifier: Joi.boolean().optional().default(false),
    isOverseasAgent: Joi.boolean().optional().default(false),
    isCHA: Joi.boolean().optional().default(false),
    isLine: Joi.boolean().optional().default(false),
    isTransporter: Joi.boolean().optional().default(false),
    isSupplier: Joi.boolean().optional().default(false),
    isDeliveryAgent: Joi.boolean().optional().default(false),
    isWarehouse: Joi.boolean().optional().default(false),
    creditDays: Joi.number().optional().default(0),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(customerVendor, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateCustomerVendor = validateCreateCustomerVendor;
