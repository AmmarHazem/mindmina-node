const mongoose = require("mongoose");

const AppointmentTimeSlotSchema = new mongoose.Schema({
  startDateTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    default: 60 * 15,
  },
  practitioner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

AppointmentTimeSlotSchema.index(
  { practitioner: 1, startDateTime: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "AppointmentTimeSlot",
  AppointmentTimeSlotSchema
);
