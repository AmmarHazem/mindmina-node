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
    practitioner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clinic: {
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
    startedByPractitioner: {
      type: Boolean,
      default: false,
    },
    endedByPractitioner: {
      type: Boolean,
      default: false,
    },
    dateStartedByPractitioner: { type: Date },
    dateEndedByPractitioner: { type: Date },
    joinedByCustomer: {
      type: Boolean,
      default: false,
    },
    endedByCustomer: {
      type: Boolean,
      default: false,
    },
    dateEndedByCustomer: { type: Date },
    dateJoinedByCustomer: { type: Date },
    approvedByClinic: { type: Boolean },
    dateApprovedByClinic: { type: Date },
    clinicFeedback: { type: String },
    paymentAmount: { type: Number },
    isCoPayment: { type: Boolean },
    isPaidByCustomer: { type: Boolean, default: false },
    datePaiedByCustomer: { type: Date },
  },
  { timestamps: true }
);

AppointmentSchema.index({ practitioner: 1 });
AppointmentSchema.index({ customer: 1 });
AppointmentSchema.index({ clinic: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);
