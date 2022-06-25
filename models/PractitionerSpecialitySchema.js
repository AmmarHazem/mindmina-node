const mongoose = require("mongoose");

const PractitionerSpecialitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

module.export = PractitionerSpecialitySchema;
