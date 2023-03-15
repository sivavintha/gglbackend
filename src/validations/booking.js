"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateBooking(booking) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    bookingNo: Joi.string().required(),
    fyear: Joi.string().required(),
    pc_code: Joi.string().required(),

    ourRefNo: Joi.string().optional(),
    exrate: Joi.string().optional(),
    freight: Joi.string().required(),
    operation: Joi.string().required(),
    shipmentType: Joi.string().required(),
    pol: Joi.string().required(),
    pod: Joi.string().required(),
    finalDestination: Joi.string().optional().allow("").allow(null),
    blNo: Joi.string().optional().allow("").allow(null).default(""),
    blType: Joi.string().optional().allow("").allow(null),
    mblTerms: Joi.string().optional().allow("").allow(null),
    hblTerms: Joi.string().optional().allow("").allow(null),
    commodity: Joi.string().optional().allow("").allow(null),
    vessel: Joi.string().optional().allow("").allow(null),
    voyage: Joi.string().optional().allow("").allow(null),
    noOfPackages: Joi.number().required(),
    grossWt: Joi.number().required(),
    netWt: Joi.number().optional().allow("").allow(null),
    cbm: Joi.number().optional().allow("").allow(null),
    description: Joi.string().optional().allow("").allow(null),
    remarks: Joi.string().optional().allow("").allow(null),
    // containers: [
    //   {
    //     number: Joi.string().required(),
    //     type: Joi.string().required(),
    //     sealNo: Joi.string().required(),
    //     noOfPackages: Joi.number().required(),
    //     grossWt: Joi.number().required(),
    //     netWt: Joi.number().required(),
    //     cbm: Joi.number().required(),
    //   },
    // ],
    // vesselSchedule: [
    //   {
    //     legNo: Joi.string().required(),
    //     vesselType: Joi.string().required(),
    //     vesselName: Joi.string().required(),
    //     voyage: Joi.string().required(),
    //     portFrom: Joi.string().required(),
    //     portTo: Joi.string().required(),

    //     ETD: Joi.date().required(),
    //     ETA: Joi.date().required(),
    //     sailedDt: Joi.date().required(),
    //     arrivedDt: Joi.date().required(),
    //   },
    // ],
    // sellRate: [
    //   {
    //     narration: Joi.string().required(),
    //     description: Joi.string().optional(),
    //     billingTo: Joi.string().required(),
    //     isSupplementary: Joi.boolean().optional().default(false),
    //     basis: Joi.string().required(),
    //     qty: Joi.number().required(),
    //     currency: Joi.string().required(),
    //     unitRate: Joi.number().required(),
    //     exrate: Joi.number().required(),
    //     amount: Joi.number().required(),
    //     isFinalled: Joi.boolean().optional().default(false),
    //   },
    // ],
    // buyRate: [
    //   {
    //     narration: Joi.string().required(),
    //     description: Joi.string().optional(),
    //     billingTo: Joi.string().required(),
    //     isSupplementary: Joi.boolean().optional().default(false),
    //     basis: Joi.string().required(),
    //     qty: Joi.number().required(),
    //     currency: Joi.string().required(),
    //     unitRate: Joi.number().required(),
    //     exrate: Joi.number().required(),
    //     amount: Joi.number().required(),
    //     isFinalled: Joi.boolean().optional().default(false),
    //   },
    // ],
    shipper: Joi.string().required(),
    consignee: Joi.string().required(),
    notifier: Joi.string().optional().default("").allow("").allow(null),
    line: Joi.string().optional().default("").allow("").allow(null),
    overseasAgent: Joi.string().optional().default("").allow("").allow(null),
    deliveryAgent: Joi.string().optional().default("").allow("").allow(null),
    transporter: Joi.string().optional().default("").allow("").allow(null),
    CHA: Joi.string().optional().default("").allow("").allow(null),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(booking, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateBooking = validateCreateBooking;
