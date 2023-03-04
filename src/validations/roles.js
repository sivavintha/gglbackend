"use strict";
const Joi = require("joi");
const joiObjectId = require("joi-objectid")(Joi);

function validateCreateRoles(roles) {
  const joiSchema = Joi.object().keys({
    _id: Joi.string(),

    code: Joi.string().required(),
    roleName: Joi.string().required(),

    createdAt: Joi.date().allow(""),
    updatedAt: Joi.date().allow(""),
    updatedBy: joiObjectId().allow(null).allow(""),
    createdBy: joiObjectId().allow(null).allow(""),
    deletedBy: joiObjectId().allow(null).allow(""),
    isDeleted: Joi.boolean().default(false),
    deletedAt: Joi.date().allow(null),
  });
  return joiSchema.validate(roles, function (err) {
    if (err) {
      return err.message;
    }
  });
}

exports.validateCreateRoles = validateCreateRoles;
