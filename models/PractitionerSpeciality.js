const mongoose = require("mongoose");
// const PractitionerSpecialitySchema = require("./PractitionerSpecialitySchema");

const PractitionerSpecialitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model(
  "PractitionerSpeciality",
  PractitionerSpecialitySchema
);
