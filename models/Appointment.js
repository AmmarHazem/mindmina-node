const mongoose = require("mongoose");

const InsuranceProvidersList = [
  {
    value: "adnic",
    name: "ADNIC",
  },
  {
    value: "daman",
    name: "DAMAN Insurance",
  },
  {
    value: "axa",
    name: "AXA Insurance",
  },
];

const AppointmentSchema = new mongoose.Schema(
  {
    slot: {
      type: mongoose.Types.ObjectId,
      ref: "AppointmentTimeSlot",
      required: true,
      unique: true,
    },
    price: { type: Number },
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
    customerIsInsured: {
      type: Boolean,
      default: true,
    },
    customerInsuranceProvider: {
      type: String,
      enum: InsuranceProvidersList.map((item) => item.value),
    },
    customerInsuranceID: { type: String },
    customerReasonOfVisit: { type: String, required: true },
    doFullPayment: { type: Boolean },
    voiceNote: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ practitioner: 1 });
AppointmentSchema.index({ customer: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);
