const mongoose = require("mongoose");
const AppointmentTimeSlotModel = require("./AppointmentTimeSlot");

const AppointmentSchema = new mongoose.Schema({
  slot: {
    type: AppointmentTimeSlotModel,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  practitioner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerResidenceStatus: {
    type: String,
    enum: ["citizen", "resident", "tourist"],
    required: true,
  },
  customerPhoneNumber: { type: String, required: true },
  customerEmiratesIDImageFront: { type: String },
  customerEmiratesIDImageBack: { type: String },
  customerEmiratesIDExpiryDate: { type: Date },
  customerPassportImage: { type: String },
  customerPassportNumber: { type: String },
  customerPassportExpiryDate: { type: Date },
  customerGender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  doFullPayment: {
    type: Boolean,
  },
  voiceNote: { type: String },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
