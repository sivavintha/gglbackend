"use strict";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nconf = require("nconf");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    dob: { type: Date, required: false, default: "" },
    gender: { type: String, required: false, default: "" },
    emailId: { type: String, required: true, unique: true },
    mobileNumber: {
      type: String,
      required: false,
      default: "",
    },
    mobileNumberCountryCode: { type: String, required: false, default: "+91" },
    phoneNumber: { type: String, required: false, default: "" },
    phoneNumberCountryCode: { type: String, required: false, default: "+91" },
    imageUrl: { type: String, required: false, default: "" },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, required: false, default: false },
    deletedAt: { type: Date, required: false, default: "" },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      emailId: this.emailId,
      mobileNumber: this.mobileNumber,
      mobileNumberCountryCode: this.mobileNumberCountryCode,
      role: this.role
    },
    nconf.get("privateKey"),
    { expiresIn: nconf.get("expiresIn") * 60 }
  );

  const exp = Date.now() + nconf.get("expiresIn") * 60 * 1000;

  return { token, exp };
};

userSchema.pre("save", async function (next) {
  let now = Date.now();

  if (!this.createdAt) {
    this.createdAt = now;
  } else {
    this.updatedAt = now;
  }

  next();
});

const Users = mongoose.model("users", userSchema);

exports.Users = Users;
