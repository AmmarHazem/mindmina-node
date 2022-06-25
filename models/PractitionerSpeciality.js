const mongoose = require("mongoose");
const PractitionerSpecialitySchema = require("./PractitionerSpecialitySchema");

module.exports = mongoose.model(
  "PractitionerSchema",
  PractitionerSpecialitySchema
);
